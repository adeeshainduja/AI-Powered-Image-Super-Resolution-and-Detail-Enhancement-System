import os
import sys
import torch

# Add project root path so Python can find the models folder
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from models.network_swinir import SwinIR


MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "models",
    "003_realSR_BSRGAN_DFO_s64w8_SwinIR-M_x4_GAN.pth"
)

SCALE = 4


def load_swinir_model(model_path=MODEL_PATH, scale=SCALE):
    """
    Load pre-trained SwinIR real-world super-resolution model.
    This model is better for blurry, noisy, compressed, and real-world low-quality images.
    """

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model weight file not found: {model_path}")

    model = SwinIR(
        upscale=scale,
        in_chans=3,
        img_size=64,
        window_size=8,
        img_range=1.0,
        depths=[6, 6, 6, 6, 6, 6],
        embed_dim=180,
        num_heads=[6, 6, 6, 6, 6, 6],
        mlp_ratio=2,
        upsampler="nearest+conv",
        resi_connection="1conv",
        use_checkpoint=True,
    )

    checkpoint = torch.load(model_path, map_location=device)

    if "params" in checkpoint:
        model.load_state_dict(checkpoint["params"], strict=True)
    elif "params_ema" in checkpoint:
        model.load_state_dict(checkpoint["params_ema"], strict=True)
    else:
        model.load_state_dict(checkpoint, strict=True)

    model.to(device)
    model.eval()

    print("Real-World SwinIR pre-trained model loaded successfully.")

    return model, device


if __name__ == "__main__":
    model, device = load_swinir_model()

    # Test using dummy low-resolution input image
    dummy_input = torch.rand(1, 3, 64, 64).to(device)

    with torch.no_grad():
        output = model(dummy_input)

    print("Input tensor shape :", dummy_input.shape)
    print("Output tensor shape:", output.shape)