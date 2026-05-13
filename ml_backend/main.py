import os
import uuid

import aiofiles
from celery.result import AsyncResult
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

try:
    from .worker import celery_app, enhance_image_task
except ImportError:
    from worker import celery_app, enhance_image_task


UPLOAD_DIR = "/tmp/imagesr/uploads"
RESULTS_DIR = "/tmp/imagesr/results"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

app = FastAPI(title="ImageSR API")

app.mount(
    "/results",
    StaticFiles(directory=RESULTS_DIR),
    name="results",
)


@app.post("/enhance")
async def enhance(
    file: UploadFile = File(...),
    scale: int = 4,
    denoise: bool = False,
    sharpen: bool = False,
):
    if scale not in [1, 2, 3, 4, 5]:
        raise HTTPException(status_code=400, detail="Scale must be 1-5.")

    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    original_filename = file.filename or ""

    ext = os.path.splitext(original_filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported image format.")

    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 20 MB limit.")

    job_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{job_id}{ext}")

    async with aiofiles.open(input_path, "wb") as f:
        await f.write(content)

    task = enhance_image_task.delay(
        job_id,
        input_path,
        scale,
        denoise,
        sharpen,
    )

    return {
        "job_id": task.id,
        "upload_id": job_id,
        "status_url": f"/status/{task.id}",
        "result_url": f"/result/{task.id}",
    }


@app.get("/status/{job_id}")
def get_status(job_id: str):
    task = AsyncResult(job_id, app=celery_app)

    if task.status == "PENDING":
        return {
            "job_id": job_id,
            "status": "PENDING",
            "message": "Job is waiting to be processed.",
        }

    if task.status in ["STARTED", "RETRY"]:
        return {
            "job_id": job_id,
            "status": task.status,
            "message": "Job is currently processing.",
        }

    if task.status == "FAILURE":
        return {
            "job_id": job_id,
            "status": "FAILURE",
            "error": str(task.result),
        }

    if task.status == "SUCCESS":
        output_path = str(task.result)

        if not output_path or output_path == "None":
            return {
                "job_id": job_id,
                "status": "SUCCESS",
                "result_path": None,
                "result_url": None,
                "download_url": None,
                "message": "Job finished, but no output path was returned.",
            }

        filename = os.path.basename(output_path)
        static_result_url = f"/results/{filename}"
        job_result_url = f"/result/{job_id}"

        return {
            "job_id": job_id,
            "status": "SUCCESS",
            "result_path": output_path,
            "result_url": static_result_url,
            "download_url": static_result_url,
            "job_result_url": job_result_url,
        }

    return {
        "job_id": job_id,
        "status": task.status,
    }


@app.get("/result/{job_id}")
def get_result(job_id: str):
    task = AsyncResult(job_id, app=celery_app)

    if not task.ready():
        raise HTTPException(status_code=202, detail="Job not complete yet.")

    if task.failed():
        raise HTTPException(status_code=500, detail=str(task.result))

    output_path = str(task.result)

    if not output_path or output_path == "None":
        raise HTTPException(status_code=404, detail="No result path returned.")

    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Result file not found.")

    return FileResponse(
        output_path,
        media_type="image/png",
        filename=os.path.basename(output_path),
    )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "upload_dir": UPLOAD_DIR,
        "results_dir": RESULTS_DIR,
        "upload_dir_exists": os.path.exists(UPLOAD_DIR),
        "results_dir_exists": os.path.exists(RESULTS_DIR),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
