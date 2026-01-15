# Docker Build & Run Guide

This guide provides step-by-step instructions for building and running your application with Docker.

---

## Prerequisites

- Docker installed on your system
- Environment variables configured (see `.env.example`)

---

## Backend Container

### Build Backend Image

```bash
# Navigate to backend directory
cd backend

# Build the Docker image
docker build -t ai-ui-backend:latest .

# Verify the image was created
docker images | grep ai-ui-backend
```

**What this does:**
- `-t ai-ui-backend:latest` = Tags the image with name and version
- `.` = Looks for Dockerfile in current directory

### Run Backend Container

```bash
# Run backend on port 4000
docker run -d \
  --name ai-ui-backend \
  -p 4000:4000 \
  -e GEMINI_API_KEY=your_api_key_here \
  -e BACKEND_PORT=4000 \
  ai-ui-backend:latest

# Check if container is running
docker ps
```

**Explanation:**
- `-d` = Detached mode (runs in background)
- `--name` = Give container a friendly name
- `-p 4000:4000` = Map host port 4000 to container port 4000
- `-e` = Set environment variables

### Backend Environment Variables

Required:
- `GEMINI_API_KEY` - Your Google Gemini API key

Optional:
- `BACKEND_PORT` - Port to run on (default: 4000)
- `GEMINI_MODEL` - Model to use (default: gemini-2.5-pro)

---

## Frontend Container

### Build Frontend Image

```bash
# Navigate to project root (not backend folder)
cd ..  # If you're in backend directory

# Build the Docker image
docker build -t ai-ui-frontend:latest .

# Verify the image was created
docker images | grep ai-ui-frontend
```

### Run Frontend Container

```bash
# Run frontend on port 80
docker run -d \
  --name ai-ui-frontend \
  -p 80:80 \
  ai-ui-frontend:latest

# Check if container is running
docker ps
```

**Explanation:**
- Frontend runs on port 80 (standard HTTP)
- Nginx serves the built React app

---

## Running Both Containers Together

### Option 1: Manual Start

```bash
# Start backend
cd backend
docker run -d \
  --name ai-ui-backend \
  -p 4000:4000 \
  -e GEMINI_API_KEY=your_api_key_here \
  ai-ui-backend:latest

# Start frontend
cd ..
docker run -d \
  --name ai-ui-frontend \
  -p 80:80 \
  ai-ui-frontend:latest

# Verify both are running
docker ps
```

### Option 2: Using Docker Network (Recommended)

```bash
# Create a network so containers can communicate
docker network create ai-ui-network

# Run backend on the network
docker run -d \
  --name ai-ui-backend \
  --network ai-ui-network \
  -p 4000:4000 \
  -e GEMINI_API_KEY=your_api_key_here \
  ai-ui-backend:latest

# Run frontend on the network
docker run -d \
  --name ai-ui-frontend \
  --network ai-ui-network \
  -p 80:80 \
  ai-ui-frontend:latest
```

---

## Verification Steps

### 1. Check Backend Health

```bash
# Using curl
curl http://localhost:4000/health

# Using browser
# Open: http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-12T...",
  "uptimeSeconds": 123,
  ...
}
```

### 2. Check Frontend

```bash
# Using browser
# Open: http://localhost
```

You should see your React application.

### 3. View Container Logs

```bash
# Backend logs
docker logs ai-ui-backend

# Follow logs in real-time
docker logs -f ai-ui-backend

# Frontend logs
docker logs ai-ui-frontend
```

### 4. Check Container Resource Usage

```bash
# View CPU, memory, network usage
docker stats ai-ui-backend ai-ui-frontend
```

---

## Useful Commands

### Stop Containers

```bash
docker stop ai-ui-backend ai-ui-frontend
```

### Start Stopped Containers

```bash
docker start ai-ui-backend ai-ui-frontend
```

### Remove Containers

```bash
# Stop and remove
docker stop ai-ui-backend ai-ui-frontend
docker rm ai-ui-backend ai-ui-frontend
```

### Remove Images

```bash
docker rmi ai-ui-backend:latest ai-ui-frontend:latest
```

### Access Container Shell (for debugging)

```bash
# Backend
docker exec -it ai-ui-backend sh

# Frontend
docker exec -it ai-ui-frontend sh

# Type 'exit' to leave
```

### View Container Details

```bash
docker inspect ai-ui-backend
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker logs ai-ui-backend

# Check if port is already in use
lsof -i :4000  # Mac/Linux
netstat -ano | findstr :4000  # Windows
```

### Can't Connect to Backend from Frontend

- Ensure both containers are on the same Docker network
- Check firewall settings
- Verify environment variables

### Container Uses Too Much Memory

```bash
# Run with memory limit
docker run -d \
  --name ai-ui-backend \
  --memory="512m" \
  -p 4000:4000 \
  ai-ui-backend:latest
```

### Permission Denied Errors

- Our containers run as non-root users for security
- This is intentional and correct

---

## Image Size Optimization

Check image sizes:
```bash
docker images
```

Expected sizes:
- Backend: ~150-200 MB (Alpine-based)
- Frontend: ~50-80 MB (Nginx + static files)

If images are larger, rebuild with `--no-cache`:
```bash
docker build --no-cache -t ai-ui-backend:latest .
```

---

## Security Notes

✅ **What we did right:**
- Multi-stage builds (smaller, more secure images)
- Non-root users in containers
- Minimal Alpine Linux base images
- No development dependencies in production
- Environment variables for secrets (not hardcoded)

⚠️ **Important:**
- Never commit `.env` files with real API keys
- Use Docker secrets in production (not `-e` flags)
- Keep Docker and base images updated

---

## Next Steps

After verifying Docker works locally, you'll deploy to Google Cloud:
1. Push images to Google Container Registry
2. Deploy to Google Cloud Run or Compute Engine
3. Set up environment variables in cloud
4. Configure domain and SSL

(We'll cover this in the next steps!)
