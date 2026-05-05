import os
import sys
from celery import Celery

sys.path.insert(0, "/app")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
RESULTS_DIR = "/tmp/imagesr/results"

celery_app = Celery("imagesr", broker=REDIS_URL, backend=REDIS_URL)

_model = None
_device = None


def _get_model():
    global _model, _device
    if _model is None:
        from src.model import load_swinir_model
        _model, _device = load_swinir_model()
    return _model, _device


@celery_app.task(name="worker.enhance_image_task", bind=True)
def enhance_image_task(self, job_id, input_path, scale, apply_denoise, apply_sharpen):
    from src.inference import (
        preprocess_image,
        run_swinir_inference,
        tensor_to_image,
        sharpen_image,
        resize_to_customer_scale,
    )

    os.makedirs(RESULTS_DIR, exist_ok=True)

    model, device = _get_model()

    input_tensor, original_size = preprocess_image(
        input_path, device, apply_denoise=apply_denoise
    )
    output_tensor = run_swinir_inference(model, input_tensor)
    enhanced = tensor_to_image(output_tensor)

    if apply_sharpen:
        enhanced = sharpen_image(enhanced)

    final = resize_to_customer_scale(enhanced, original_size, scale)

    output_path = os.path.join(RESULTS_DIR, f"{job_id}_enhanced_{scale}x.png")
    final.save(output_path)

    return output_path
