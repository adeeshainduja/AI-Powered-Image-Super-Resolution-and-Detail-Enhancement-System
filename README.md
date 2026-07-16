<div align="center">

# 🚀 AI-Powered Image Super-Resolution and Detail Enhancement System

### Enhance Low-Resolution Images using Deep Learning (SwinIR)

<p align="center">
<img src="https://img.shields.io/badge/Python-3.10-blue?logo=python">
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react">
<img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js">
<img src="https://img.shields.io/badge/PyTorch-DeepLearning-EE4C2C?logo=pytorch">
<img src="https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker">
<img src="https://img.shields.io/badge/Nginx-ReverseProxy-009639?logo=nginx">
<img src="https://img.shields.io/badge/License-MIT-green">
</p>

An AI-powered web application that enhances low-resolution images using **SwinIR (Image Restoration Transformer)** to produce high-resolution, sharper, and cleaner images.

**Designed for Graphic Designers, Photographers, Digital Artists, and Content Creators.**

🎥 **Demo Video:** https://youtu.be/vyPhAFuzRL4

</div>

---

# 📖 Table of Contents

- About
- Motivation
- Features
- Technologies
- System Architecture
- Workflow
- Project Structure
- Installation
- Docker Deployment
- API Flow
- SwinIR Model
- Results
- Future Improvements
- Demo
- Developer
- License

---

# 📌 About

This project is an AI-powered Image Super-Resolution and Detail Enhancement System developed to improve the quality of low-resolution images.

The application increases image resolution while preserving fine details, sharpening textures, and reducing noise using a deep learning model based on **SwinIR**.

The complete system follows a microservice architecture consisting of:

- React Frontend
- Node.js API Backend
- Python Machine Learning Backend
- Docker Containers
- Nginx Reverse Proxy & Load Balancer

---

# 💡 Motivation

As a former Graphic Designer, I often created large banner designs, posters, and marketing materials.

One of the biggest challenges was finding high-resolution background images.

Most images downloaded from the internet were low resolution, causing blurry and pixelated results after scaling.

Although online image upscalers exist, they often:

- Produce unrealistic details
- Require paid subscriptions
- Limit image size
- Reduce image quality

Therefore, I built this AI-powered application to solve this real-world problem using state-of-the-art deep learning techniques.

---

# ✨ Features

✅ AI-based Super Resolution

✅ Image Detail Enhancement

✅ Image Sharpening

✅ Noise Reduction

✅ High Quality Image Reconstruction

✅ Upload Images

✅ Download Enhanced Images

✅ Fast REST API

✅ Docker Deployment

✅ Nginx Reverse Proxy

✅ Load Balancing

✅ Responsive User Interface

---

# 🛠 Technologies Used

## Frontend

- React.js
- HTML5
- CSS3
- JavaScript

---

## Backend

### API Backend

- Node.js
- Express.js

### Machine Learning Backend

- Python
- PyTorch
- SwinIR

---

## Deployment

- Docker
- Docker Compose
- Nginx

---

# 🏗 System Architecture

```text
                User
                  │
                  ▼
        React Frontend
                  │
                  ▼
      Node.js + Express API
                  │
       REST API Request
                  │
                  ▼
     Python ML Backend (SwinIR)
                  │
      Image Enhancement Process
                  │
                  ▼
      Enhanced High Resolution Image
                  │
                  ▼
             Frontend
```

---

# ⚙ Workflow

### Step 1

User uploads a low-resolution image.

↓

### Step 2

React frontend sends the image to the Node.js backend.

↓

### Step 3

Node.js validates the request and forwards the image to the Python ML backend.

↓

### Step 4

The SwinIR model performs:

- Super Resolution
- Detail Enhancement
- Noise Reduction
- Image Reconstruction

↓

### Step 5

The enhanced image is returned to Node.js.

↓

### Step 6

Node.js sends the processed image back to the frontend.

↓

### Step 7

User previews and downloads the enhanced image.

---

# 📂 Project Structure

```text
AI-Powered-Image-Super-Resolution-and-Detail-Enhancement-System

│
├── frontend/
│     ├── src/
│     ├── public/
│
├── backend/
│     ├── node-backend/
│     └── ml-backend/
│
├── nginx/
│
├── docker-compose.yml
│
├── Dockerfile
│
└── README.md
```

---

# 🤖 SwinIR Model

This project uses **SwinIR (Image Restoration Transformer)**.

### SwinIR provides:

- Image Super Resolution
- Image Denoising
- Detail Enhancement
- JPEG Artifact Removal
- Image Reconstruction

### Advantages

✔ Better texture reconstruction

✔ High PSNR

✔ High SSIM

✔ Transformer-based architecture

✔ Better visual quality than CNN models

---

# 🌐 REST API Flow

```text
React Frontend

↓

POST /upload

↓

Node.js API

↓

Python ML API

↓

SwinIR Model

↓

Enhanced Image

↓

Node.js

↓

React Frontend
```

---

# 🐳 Docker Deployment

Clone the repository

```bash
git clone https://github.com/adeeshainduja/AI-Powered-Image-Super-Resolution-and-Detail-Enhancement-System.git
```

Move into project

```bash
cd AI-Powered-Image-Super-Resolution-and-Detail-Enhancement-System
```

Build Docker

```bash
docker-compose build
```

Run containers

```bash
docker-compose up
```

Application starts automatically.

---

# 📸 Results

## Before vs After

> Replace the image below with your own comparison screenshot.

![Results](Application
/Test_enhancement.jpeg)

---

# 🎥 Demo Video

Watch the full demonstration here:

https://youtu.be/vyPhAFuzRL4

---

# 🚀 Future Improvements

- Batch Image Enhancement
- Authentication System
- User Dashboard
- Cloud Storage
- GPU Optimization
- Image History
- ESRGAN Support
- Real-ESRGAN Support
- Mobile Version

---

# 👨‍💻 Developer

### Adeesha Induja

GitHub

https://github.com/adeeshainduja

---

# ⭐ Support

If you found this project helpful,

please consider giving it a ⭐ on GitHub.

It really helps!

---

# 📄 License

This project is licensed under the MIT License.
