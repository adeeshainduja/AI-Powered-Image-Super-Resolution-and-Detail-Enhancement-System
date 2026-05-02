import os
import sys
import torch
import numpy as np
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from src.model import load_swinir_model


INPUT_IMAGE = os.path.join(PROJECT_ROOT, "data", "test.png")
OUTPUT_IMAGE = os.path.join(PROJECT_ROOT, "results", "enhanced_x4.png")


def preprocess_image(image_path, device):
    image = Image.open(image_path).convert("RGB")

    img = np.array(image).astype(np.float32) / 255.0
    img = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0)
    img = img.to(device)

    return img


def postprocess_image(output_tensor):
    output = output_tensor.squeeze(0).detach().cpu().clamp(0, 1)
    output = output.permute(1, 2, 0).numpy()
    output = (output * 255.0).round().astype(np.uint8)

    return Image.fromarray(output)


def enhance_image():
    os.makedirs(os.path.join(PROJECT_ROOT, "results"), exist_ok=True)

    model, device = load_swinir_model()

    input_tensor = preprocess_image(INPUT_IMAGE, device)

    print("Running SwinIR inference...")

    with torch.no_grad():
        output_tensor = model(input_tensor)

    output_image = postprocess_image(output_tensor)
    output_image.save(OUTPUT_IMAGE)

    print("Enhanced image saved to:")
    print(OUTPUT_IMAGE)


if __name__ == "__main__":
    enhance_image()