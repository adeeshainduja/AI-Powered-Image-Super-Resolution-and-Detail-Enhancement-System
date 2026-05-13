FROM pytorch/pytorch:2.10.0-cuda12.8-cudnn9-runtime

WORKDIR /app

# 1. Copy the requirements file into the container FIRST
COPY requirements.txt .

# 2. Upgrade pip (optional, but good practice)
RUN pip install --break-system-packages --upgrade pip

# 3. NOW install the dependencies, because the file actually exists
RUN pip install \
    --break-system-packages \
    --retries 10 \
    --timeout 300 \
    -r requirements.txt 

# 4. Copy the rest of your application code
COPY . .

EXPOSE 8000