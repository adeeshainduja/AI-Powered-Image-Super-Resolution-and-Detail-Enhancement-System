# Use the same PyTorch base image
FROM pytorch/pytorch:2.10.0-cuda12.8-cudnn9-runtime

WORKDIR /app

# 1. Copy requirements from the worker folder specifically
# (Since the context is now root, we point to the subfolder)
COPY worker/requirements.txt .

# 2. Upgrade pip
RUN pip install --break-system-packages --upgrade pip

# 3. Install dependencies
RUN pip install \
    --break-system-packages \
    --retries 10 \
    --timeout 300 \
    -r requirements.txt

# 4. Copy everything from the root into /app
# This ensures ml_backend, src, and models are all available
COPY . .