import os
import sys
import torch
import numpy as np
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from src.model import load_swinir_model


INPUT_IMAGE = os.path.join(PROJECT_ROOT, "data", "test.png")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "results")


def get_user_scale():
    while True:
        try:
            scale = int(input("Enter required scale (1x, 2x, 3x, 4x, 5x): "))
            if scale in [1, 2, 3, 4, 5]:
                return scale
            else:
                print("Please enter only 1, 2, 3, 4, or 5.")
        except ValueError:
            print("Invalid input. Please enter a number.")


def preprocess_image(image_path, device):
    image = Image.open(image_path).convert("RGB")
    original_size = image.size  # (width, height)

    img = np.array(image).astype(np.float32) / 255.0
    img = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0)
    img = img.to(device)

    return img, original_size


def postprocess_image(output_tensor, original_size, requested_scale):
    output = output_tensor.squeeze(0).detach().cpu().clamp(0, 1)
    output = output.permute(1, 2, 0).numpy()
    output = (output * 255.0).round().astype(np.uint8)

    output_image = Image.fromarray(output)

    # Calculate final target size according to customer-selected scale
    target_width = original_size[0] * requested_scale
    target_height = original_size[1] * requested_scale
    target_size = (target_width, target_height)

    # Resize x4 SwinIR output to the requested final size
    if output_image.size != target_size:
        output_image = output_image.resize(target_size, Image.Resampling.LANCZOS)

    return output_image


def enhance_image():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    requested_scale = get_user_scale()

    model, device = load_swinir_model()
    input_tensor, original_size = preprocess_image(INPUT_IMAGE, device)

    print(f"Running SwinIR inference for customer-selected scale: {requested_scale}x")

    with torch.no_grad():
        output_tensor = model(input_tensor)

    output_image = postprocess_image(output_tensor, original_size, requested_scale)

    output_path = os.path.join(OUTPUT_DIR, f"enhanced_{requested_scale}x.png")
    output_image.save(output_path)

    print("Enhanced image saved to:")
    print(output_path)
    print("Final output size:", output_image.size)


if __name__ == "__main__":
    enhance_image()