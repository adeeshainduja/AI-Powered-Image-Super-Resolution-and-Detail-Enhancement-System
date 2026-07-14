# AWS Deployment Guide

This document explains how to host the AI-powered image super-resolution system on Amazon Web Services.

## Recommended architecture

The project is already structured as a multi-service application with:
- a FastAPI backend
- a Celery worker for image processing
- a Redis queue
- a frontend UI
- Nginx as a reverse proxy

For AWS, the most practical production deployment is:
- one GPU-powered EC2 instance
- Docker Compose for container orchestration
- Redis running in the same host or via ElastiCache
- S3 for persistent image storage
- Route 53 and ACM for HTTPS if you use a custom domain

## 1. Choose an EC2 instance

Use a GPU instance such as:
- g4dn.xlarge for a starter deployment
- g5.xlarge for better performance

Launch an Ubuntu 22.04 instance with:
- at least 30 GB SSD storage
- a security group that allows:
  - SSH on port 22 from your IP
  - HTTP on port 80 from anywhere
  - HTTPS on port 443 from anywhere

## 2. Install Docker and NVIDIA support

Connect to the server over SSH:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

Reboot the instance:

```bash
sudo reboot
```

After reboot, install NVIDIA container toolkit:

```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo systemctl restart docker
```

## 3. Prepare persistent storage

The application writes image files under temporary directories. For production, use either:
- an EBS volume mounted at /data, or
- S3 for uploads and results

Example:

```bash
sudo mkdir -p /data/imagesr
sudo chown -R ubuntu:ubuntu /data/imagesr
```

## 4. Create an S3 bucket

Create an S3 bucket for:
- uploaded images
- processed output files
- optional backups

Create an IAM policy with permissions such as:
- s3:PutObject
- s3:GetObject
- s3:ListBucket

Attach those permissions to the EC2 instance role.

## 5. Clone the project

On the server:

```bash
cd /home/ubuntu
git clone <your-repo-url>
cd AI-Powered-Image-Super-Resolution-and-Detail-Enhancement-System
```

Create a `.env` file:

```env
REDIS_URL=redis://redis:6379/0
UPLOAD_DIR=/data/imagesr/uploads
RESULTS_DIR=/data/imagesr/results
```

## 6. Deploy with Docker Compose

Run:

```bash
docker compose up -d --build
```

Check the containers:

```bash
docker compose ps
docker compose logs -f
```

## 7. Configure Nginx and HTTPS

The repository already includes Nginx configuration. Make sure the service is reachable on port 80 and that file upload limits are sufficient.

For HTTPS, install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 8. Point your domain to the server

Use Route 53 or your DNS provider to create:
- an A record for the EC2 public IP, or
- a CNAME if you are using a load balancer

## 9. Add production reliability features

Recommended next steps:
- enable CloudWatch logging
- create EBS snapshots
- configure automatic Docker service restarts
- move uploads and results to S3 for durability

## Recommended deployment path

For the first production version, the simplest and most reliable approach is:
1. deploy on one GPU EC2 instance
2. run the app with Docker Compose
3. use EBS or S3 for image storage
4. enable HTTPS
5. use a domain name

## Notes for this project

This application uses GPU-based inference and a background worker queue, so a single GPU EC2 host is a strong fit. The current code stores files under local temporary folders, so production persistence should be improved before launch.
