import os
import sys
import time
import torch
import numpy as np
from PIL import Image

import cv2
from skimage.metrics import peak_signal_noise_ratio, structural_similarity


# ==========================================================
# PROJECT PATH SETUP
# ==========================================================

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from src.model import load_swinir_model


# ==========================================================
# PATH CONFIGURATION
# ==========================================================

INPUT_IMAGE = os.path.join(PROJECT_ROOT, "data", "test.png")

# Optional HR reference image for PSNR / SSIM.
# Keep None if you do not have a reference image.
REFERENCE_IMAGE = None

# Example:
# REFERENCE_IMAGE = os.path.join(PROJECT_ROOT, "data", "reference.png")

OUTPUT_DIR = os.path.join(PROJECT_ROOT, "results")


# ==========================================================
# FUNCTION 1: CUSTOMER SCALE INPUT
# ==========================================================

def get_customer_scale():
    """
    Ask customer to select the required output scale.
    Allowed values: 1x, 2x, 3x, 4x, 5x
    """

    while True:
        try:
            scale = int(input("Enter required scale 1, 2, 3, 4, or 5: "))

            if scale in [1, 2, 3, 4, 5]:
                return scale

            print("Invalid scale. Please enter only 1, 2, 3, 4, or 5.")

        except ValueError:
            print("Invalid input. Please enter a number.")


# ==========================================================
# FUNCTION 2: YES / NO INPUT
# ==========================================================

def get_yes_no_input(message):
    """
    Ask customer yes/no question.
    Returns True for yes, False for no.
    """

    while True:
        answer = input(message + " (y/n): ").strip().lower()

        if answer in ["y", "yes"]:
            return True

        if answer in ["n", "no"]:
            return False

        print("Invalid input. Please enter y or n.")


# ==========================================================
# FUNCTION 3: IMAGE VALIDATION
# ==========================================================

def validate_image_file(image_path):
    """
    Validate whether image exists, has supported extension,
    and is not corrupted.
    """

    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp", ".bmp"]

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Input image not found: {image_path}")

    ext = os.path.splitext(image_path)[1].lower()

    if ext not in allowed_extensions:
        raise ValueError(
            "Unsupported image format. Please use JPG, JPEG, PNG, WEBP, or BMP."
        )

    try:
        image = Image.open(image_path)
        image.verify()
    except Exception:
        raise ValueError("Invalid or corrupted image file.")

    print("Image validation completed successfully.")
    return True


# ==========================================================
# FUNCTION 4: NOISE REDUCTION
# ==========================================================

def reduce_noise(image):
    """
    Apply mild OpenCV noise reduction.
    Use this only for noisy/compressed images.
    For clean portrait images, keep this disabled.
    """

    img = np.array(image)

    denoised = cv2.fastNlMeansDenoisingColored(
        img,
        None,
        h=3,
        hColor=3,
        templateWindowSize=7,
        searchWindowSize=21
    )

    return Image.fromarray(denoised)


# ==========================================================
# FUNCTION 5: IMAGE PREPROCESSING
# ==========================================================

def preprocess_image(image_path, device, apply_denoise=False):
    """
    Load image, optionally denoise, normalize pixel values to [0, 1],
    and convert to PyTorch tensor.
    """

    image = Image.open(image_path).convert("RGB")
    original_size = image.size  # (width, height)

    if apply_denoise:
        print("Applying noise reduction...")
        image = reduce_noise(image)
    else:
        print("Noise reduction skipped.")

    img = np.array(image).astype(np.float32) / 255.0

    img_tensor = torch.from_numpy(img)
    img_tensor = img_tensor.permute(2, 0, 1).unsqueeze(0)
    img_tensor = img_tensor.to(device)

    return img_tensor, original_size


# ==========================================================
# FUNCTION 6: SWINIR INFERENCE
# ==========================================================

_TILE_SIZE = 256   # max tile edge (pixels) — safe for 4 GB GPU with SwinIR-M
_TILE_OVERLAP = 32 # overlap to blend seams between tiles
_SCALE = 4         # must match the loaded model's upscale factor


def run_swinir_inference(model, input_tensor):
    """
    Run SwinIR inference using tiled processing so that arbitrarily
    large inputs do not exhaust GPU memory.  Each tile is processed
    independently; a weighted blend in the overlap region removes seams.
    Falls back to a single forward pass when the image is small enough.
    """
    _, _, h, w = input_tensor.shape

    # Small images: direct inference is fine
    if h <= _TILE_SIZE and w <= _TILE_SIZE:
        with torch.no_grad():
            return model(input_tensor)

    device = input_tensor.device
    stride = _TILE_SIZE - _TILE_OVERLAP
    out_h = h * _SCALE
    out_w = w * _SCALE

    output = torch.zeros(1, 3, out_h, out_w, device=device)
    weight = torch.zeros(1, 1, out_h, out_w, device=device)

    # Build a 1-D Hann window and make a 2-D blending mask
    hann_1d = torch.hann_window(_TILE_SIZE * _SCALE, periodic=False, device=device)
    blend_mask = hann_1d.unsqueeze(0) * hann_1d.unsqueeze(1)  # (T, T)
    blend_mask = blend_mask.unsqueeze(0).unsqueeze(0)          # (1, 1, T, T)

    for y in range(0, h, stride):
        for x in range(0, w, stride):
            y_end = min(y + _TILE_SIZE, h)
            x_end = min(x + _TILE_SIZE, w)
            y_start = y_end - _TILE_SIZE if y_end - y < _TILE_SIZE else y
            x_start = x_end - _TILE_SIZE if x_end - x < _TILE_SIZE else x

            tile = input_tensor[:, :, y_start:y_end, x_start:x_end]

            with torch.no_grad():
                tile_out = model(tile)

            oy = y_start * _SCALE
            ox = x_start * _SCALE
            ot_h = tile_out.shape[2]
            ot_w = tile_out.shape[3]

            # Trim blend mask to match actual tile output size
            mask = blend_mask[:, :, :ot_h, :ot_w]

            output[:, :, oy:oy + ot_h, ox:ox + ot_w] += tile_out * mask
            weight[:, :, oy:oy + ot_h, ox:ox + ot_w] += mask

    output = output / weight.clamp(min=1e-8)
    return output


# ==========================================================
# FUNCTION 7: TENSOR TO IMAGE
# ==========================================================

def tensor_to_image(output_tensor):
    """
    Convert SwinIR output tensor into PIL image.
    """

    output = output_tensor.squeeze(0).detach().cpu().clamp(0, 1)
    output = output.permute(1, 2, 0).numpy()
    output = (output * 255.0).round().astype(np.uint8)

    return Image.fromarray(output)


# ==========================================================
# FUNCTION 8: DETAIL SHARPENING
# ==========================================================

def sharpen_image(image):
    """
    Apply mild sharpening.
    Use only if the output looks soft.
    Do not use for already clean images unless needed.
    """

    img = np.array(image)

    blurred = cv2.GaussianBlur(img, (0, 0), 1.0)

    sharpened = cv2.addWeighted(
        img,
        1.2,     # original image strength
        blurred,
        -0.2,    # blur subtraction strength
        0
    )

    return Image.fromarray(sharpened)


# ==========================================================
# FUNCTION 9: RESIZE TO CUSTOMER SCALE
# ==========================================================

def resize_to_customer_scale(image, original_size, scale):
    """
    Resize final enhanced image according to customer-selected scale.
    """

    if scale not in [1, 2, 3, 4, 5]:
        raise ValueError("Scale must be 1, 2, 3, 4, or 5.")

    target_width = original_size[0] * scale
    target_height = original_size[1] * scale

    target_size = (target_width, target_height)

    if image.size == target_size:
        return image

    resized_image = image.resize(
        target_size,
        Image.Resampling.LANCZOS
    )

    return resized_image


# ==========================================================
# FUNCTION 10: SAVE OUTPUT IMAGE
# ==========================================================

def save_output_image(image, output_dir, scale):
    """
    Save final enhanced image to results folder.
    """

    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, f"enhanced_{scale}x.png")
    image.save(output_path)

    return output_path


# ==========================================================
# FUNCTION 11: PSNR AND SSIM CALCULATION
# ==========================================================

def calculate_psnr_ssim(output_image, reference_image_path):
    """
    Calculate PSNR and SSIM if a reference HR image is available.
    If no reference image is provided, return None.
    """

    if reference_image_path is None:
        return None, None

    if not os.path.exists(reference_image_path):
        raise FileNotFoundError(f"Reference image not found: {reference_image_path}")

    reference_image = Image.open(reference_image_path).convert("RGB")

    if reference_image.size != output_image.size:
        reference_image = reference_image.resize(
            output_image.size,
            Image.Resampling.LANCZOS
        )

    output_np = np.array(output_image)
    reference_np = np.array(reference_image)

    psnr = peak_signal_noise_ratio(
        reference_np,
        output_np,
        data_range=255
    )

    ssim = structural_similarity(
        reference_np,
        output_np,
        channel_axis=2,
        data_range=255
    )

    return round(psnr, 4), round(ssim, 4)


# ==========================================================
# MAIN IMAGE ENHANCEMENT PIPELINE
# ==========================================================

def enhance_image():
    """
    Complete ImageSR enhancement pipeline.
    """

    print("\nStarting ImageSR enhancement pipeline...\n")

    validate_image_file(INPUT_IMAGE)

    customer_scale = get_customer_scale()

    apply_denoise = get_yes_no_input(
        "Apply noise reduction? Use this only for noisy/blurry/compressed images"
    )

    apply_sharpen = get_yes_no_input(
        "Apply detail sharpening? Use this only if output looks soft"
    )

    model, device = load_swinir_model()

    start_time = time.time()

    input_tensor, original_size = preprocess_image(
        INPUT_IMAGE,
        device,
        apply_denoise=apply_denoise
    )

    print("Running SwinIR inference...")

    output_tensor = run_swinir_inference(
        model,
        input_tensor
    )

    enhanced_image = tensor_to_image(output_tensor)

    if apply_sharpen:
        print("Applying detail sharpening...")
        enhanced_image = sharpen_image(enhanced_image)
    else:
        print("Detail sharpening skipped.")

    final_image = resize_to_customer_scale(
        enhanced_image,
        original_size,
        customer_scale
    )

    output_path = save_output_image(
        final_image,
        OUTPUT_DIR,
        customer_scale
    )

    psnr, ssim = calculate_psnr_ssim(
        final_image,
        REFERENCE_IMAGE
    )

    end_time = time.time()
    processing_time = round(end_time - start_time, 2)

    print("\nEnhancement completed successfully.")
    print("Input image:", INPUT_IMAGE)
    print("Output image:", output_path)
    print("Original size:", original_size)
    print("Final output size:", final_image.size)
    print("Selected scale:", f"{customer_scale}x")
    print("Noise reduction:", "Enabled" if apply_denoise else "Disabled")
    print("Detail sharpening:", "Enabled" if apply_sharpen else "Disabled")
    print("Processing time:", processing_time, "seconds")

    if psnr is not None and ssim is not None:
        print("PSNR:", psnr)
        print("SSIM:", ssim)
    else:
        print("PSNR/SSIM: Not calculated because reference HR image was not provided.")


# ==========================================================
# PROGRAM ENTRY POINT
# ==========================================================

if __name__ == "__main__":
    enhance_image()