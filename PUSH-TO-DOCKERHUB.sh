#!/bin/bash

# Docker Hub Push Script
# This script helps you push your images to Docker Hub

set -e  # Exit on error

echo "====================================="
echo "Docker Hub Push Script"
echo "====================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Prompt for Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo "❌ Error: Username cannot be empty"
    exit 1
fi

echo ""
echo "Using Docker Hub username: $DOCKER_USERNAME"
echo ""

# Check if user is logged in
echo "Checking Docker Hub login status..."
if docker info 2>/dev/null | grep -q "Username: $DOCKER_USERNAME"; then
    echo "✅ Already logged in as $DOCKER_USERNAME"
else
    echo "⚠️  Not logged in. Please login:"
    docker login
fi

echo ""
echo "====================================="
echo "Step 1: Building Backend Image"
echo "====================================="
echo ""

cd backend
docker build -t ai-ui-backend:latest .
echo "✅ Backend image built"
cd ..

echo ""
echo "====================================="
echo "Step 2: Building Frontend Image"
echo "====================================="
echo ""

docker build -t ai-ui-frontend:latest .
echo "✅ Frontend image built"

echo ""
echo "====================================="
echo "Step 3: Tagging Images"
echo "====================================="
echo ""

docker tag ai-ui-backend:latest $DOCKER_USERNAME/ai-ui-backend:latest
echo "✅ Backend tagged as $DOCKER_USERNAME/ai-ui-backend:latest"

docker tag ai-ui-frontend:latest $DOCKER_USERNAME/ai-ui-frontend:latest
echo "✅ Frontend tagged as $DOCKER_USERNAME/ai-ui-frontend:latest"

echo ""
echo "====================================="
echo "Step 4: Pushing to Docker Hub"
echo "====================================="
echo ""

echo "Pushing backend (this may take a few minutes)..."
docker push $DOCKER_USERNAME/ai-ui-backend:latest
echo "✅ Backend pushed successfully"

echo ""
echo "Pushing frontend (this may take a few minutes)..."
docker push $DOCKER_USERNAME/ai-ui-frontend:latest
echo "✅ Frontend pushed successfully"

echo ""
echo "====================================="
echo "✅ SUCCESS! Images pushed to Docker Hub"
echo "====================================="
echo ""
echo "Your images are now available at:"
echo "  🔹 Backend:  docker.io/$DOCKER_USERNAME/ai-ui-backend:latest"
echo "  🔹 Frontend: docker.io/$DOCKER_USERNAME/ai-ui-frontend:latest"
echo ""
echo "Verify at: https://hub.docker.com/repositories"
echo ""
echo "Next step: Deploy to Google Cloud!"
echo ""
