import os
import uuid
import aiofiles
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from celery.result import AsyncResult
from worker import celery_app, enhance_image_task

UPLOAD_DIR = "/tmp/imagesr/uploads"
RESULTS_DIR = "/tmp/imagesr/results"

app = FastAPI(title="ImageSR API")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)


@app.post("/enhance")
async def enhance(
    file: UploadFile = File(...),
    scale: int = 4,
    denoise: bool = False,
    sharpen: bool = False,
):
    if scale not in [1, 2, 3, 4, 5]:
        raise HTTPException(status_code=400, detail="Scale must be 1-5.")

    allowed = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Unsupported image format.")

    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 20 MB limit.")

    job_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{job_id}{ext}")

    async with aiofiles.open(input_path, "wb") as f:
        await f.write(content)

    task = enhance_image_task.delay(job_id, input_path, scale, denoise, sharpen)

    return {"job_id": task.id}


@app.get("/status/{job_id}")
def get_status(job_id: str):
    result = AsyncResult(job_id, app=celery_app)
    return {"job_id": job_id, "status": result.status}


@app.get("/result/{job_id}")
def get_result(job_id: str):
    result = AsyncResult(job_id, app=celery_app)
    if not result.ready():
        raise HTTPException(status_code=202, detail="Job not complete yet.")
    if result.failed():
        raise HTTPException(status_code=500, detail=str(result.result))

    output_path = result.get()
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Result file not found.")

    return FileResponse(output_path, media_type="image/png")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
