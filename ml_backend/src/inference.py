from PIL import Image, ImageFilter
import torch
import torchvision.transforms as transforms


def preprocess_image(image_path, device, apply_denoise=False):
    image = Image.open(image_path).convert("RGB")

    original_size = image.size

    transform = transforms.ToTensor()

    tensor = transform(image).unsqueeze(0).to(device)

    return tensor, original_size


def run_swinir_inference(model, input_tensor):
    with torch.no_grad():
        output = model(input_tensor)

    return output


def tensor_to_image(output_tensor):
    output_tensor = output_tensor.squeeze(0).cpu().clamp(0, 1)

    image = transforms.ToPILImage()(output_tensor)

    return image


def sharpen_image(image):
    return image.filter(ImageFilter.SHARPEN)


def resize_to_customer_scale(image, original_size, scale):
    width, height = original_size

    new_size = (width * scale, height * scale)

    return image.resize(new_size, Image.LANCZOS)