#!/bin/bash

# GKE Deployment Script
# This script guides you through deploying to Google Kubernetes Engine

set -e  # Exit on error

echo "=========================================="
echo "🚀 GKE Deployment Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker installed${NC}"

# Check gcloud
if ! command -v gcloud &> /dev/null; then
    echo -e "${YELLOW}⚠️  gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
echo -e "${GREEN}✅ gcloud CLI installed${NC}"

# Check kubectl
if ! command -v kubectl &> /dev/null; then
    echo -e "${YELLOW}⚠️  kubectl is not installed${NC}"
    echo "Installing kubectl..."
    gcloud components install kubectl
fi
echo -e "${GREEN}✅ kubectl installed${NC}"

echo ""
echo "=========================================="
echo "📝 Configuration"
echo "=========================================="
echo ""

# Get configuration from user
read -p "Enter your Docker Hub username: " DOCKER_USERNAME
read -p "Enter your Google Cloud project ID (or create new): " PROJECT_ID
read -p "Enter cluster name [ai-ui-cluster]: " CLUSTER_NAME
CLUSTER_NAME=${CLUSTER_NAME:-ai-ui-cluster}
read -p "Enter zone [us-central1-a]: " ZONE
ZONE=${ZONE:-us-central1-a}
read -p "Enter namespace [ai-ui]: " NAMESPACE
NAMESPACE=${NAMESPACE:-ai-ui}

echo ""
echo "Configuration:"
echo "  Docker Hub: $DOCKER_USERNAME"
echo "  GCP Project: $PROJECT_ID"
echo "  Cluster: $CLUSTER_NAME"
echo "  Zone: $ZONE"
echo "  Namespace: $NAMESPACE"
echo ""

read -p "Continue with this configuration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "=========================================="
echo "📦 Step 1: Build & Push Docker Images"
echo "=========================================="
echo ""

read -p "Have you already pushed images to Docker Hub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Building and pushing images..."

    # Login to Docker Hub
    docker login

    # Build backend
    echo "Building backend..."
    cd backend
    docker build -t ai-ui-backend:latest .
    docker tag ai-ui-backend:latest $DOCKER_USERNAME/ai-ui-backend:latest
    docker push $DOCKER_USERNAME/ai-ui-backend:latest
    cd ..

    # Build frontend
    echo "Building frontend..."
    docker build -t ai-ui-frontend:latest .
    docker tag ai-ui-frontend:latest $DOCKER_USERNAME/ai-ui-frontend:latest
    docker push $DOCKER_USERNAME/ai-ui-frontend:latest

    echo -e "${GREEN}✅ Images pushed${NC}"
else
    echo -e "${GREEN}✅ Skipping image push${NC}"
fi

echo ""
echo "=========================================="
echo "☁️  Step 2: Setup Google Cloud Project"
echo "=========================================="
echo ""

# Set project
gcloud config set project $PROJECT_ID 2>/dev/null || {
    echo "Project doesn't exist. Creating..."
    gcloud projects create $PROJECT_ID
    gcloud config set project $PROJECT_ID
}

echo "Enabling required APIs..."
gcloud services enable container.googleapis.com --quiet
gcloud services enable compute.googleapis.com --quiet

echo -e "${GREEN}✅ Google Cloud setup complete${NC}"

echo ""
echo "=========================================="
echo "🔧 Step 3: Create GKE Cluster"
echo "=========================================="
echo ""

# Check if cluster exists
if gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE &> /dev/null; then
    echo -e "${YELLOW}Cluster already exists${NC}"
    read -p "Use existing cluster? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
else
    echo "Creating GKE cluster (this takes 5-10 minutes)..."
    echo ""
    echo "Cluster configuration:"
    echo "  - 2 nodes (e2-small)"
    echo "  - Auto-scaling: 1-3 nodes"
    echo "  - Estimated cost: ~$30-40/month"
    echo ""

    read -p "Create cluster with this config? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi

    gcloud container clusters create $CLUSTER_NAME \
        --zone=$ZONE \
        --num-nodes=2 \
        --machine-type=e2-small \
        --disk-size=10GB \
        --enable-autoscaling \
        --min-nodes=1 \
        --max-nodes=3 \
        --enable-autorepair \
        --enable-autoupgrade

    echo -e "${GREEN}✅ Cluster created${NC}"
fi

echo ""
echo "=========================================="
echo "🔌 Step 4: Configure kubectl"
echo "=========================================="
echo ""

gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE

# Test connection
if kubectl get nodes &> /dev/null; then
    echo -e "${GREEN}✅ Connected to cluster${NC}"
    kubectl get nodes
else
    echo -e "${RED}❌ Failed to connect to cluster${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo "📄 Step 5: Update Kubernetes Manifests"
echo "=========================================="
echo ""

# Update image names in deployment files
echo "Updating image names in manifests..."

# Backup original files
cp k8s/backend/deployment.yaml k8s/backend/deployment.yaml.bak
cp k8s/frontend/deployment.yaml k8s/frontend/deployment.yaml.bak

# Replace username in manifests
sed -i.tmp "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_USERNAME/g" k8s/backend/deployment.yaml
sed -i.tmp "s/YOUR_DOCKERHUB_USERNAME/$DOCKER_USERNAME/g" k8s/frontend/deployment.yaml

# Clean up temp files
rm k8s/backend/deployment.yaml.tmp k8s/frontend/deployment.yaml.tmp

echo -e "${GREEN}✅ Manifests updated${NC}"

echo ""
echo "=========================================="
echo "🔐 Step 6: Create Secrets"
echo "=========================================="
echo ""

read -p "Enter your Gemini API key: " GEMINI_API_KEY

# Create namespace
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Create secret
kubectl create secret generic backend-secrets \
    --from-literal=GEMINI_API_KEY=$GEMINI_API_KEY \
    -n $NAMESPACE \
    --dry-run=client -o yaml | kubectl apply -f -

echo -e "${GREEN}✅ Secrets created${NC}"

echo ""
echo "=========================================="
echo "🚀 Step 7: Deploy to Kubernetes"
echo "=========================================="
echo ""

echo "Deploying backend..."
kubectl apply -f k8s/backend/ -n $NAMESPACE

echo "Deploying frontend..."
kubectl apply -f k8s/frontend/ -n $NAMESPACE

echo -e "${GREEN}✅ Deployment initiated${NC}"

echo ""
echo "Waiting for pods to be ready (this may take 2-3 minutes)..."
kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s

echo ""
echo "=========================================="
echo "🌐 Step 8: Get External IP"
echo "=========================================="
echo ""

echo "Waiting for LoadBalancer IP (this may take 2-3 minutes)..."
echo "You can press Ctrl+C and run 'kubectl get svc -n $NAMESPACE' to check later"
echo ""

kubectl get service frontend-service -n $NAMESPACE --watch

# Note: The watch will continue until Ctrl+C

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Your application is now running on GKE!"
echo ""
echo "Useful commands:"
echo ""
echo "  # Get external IP"
echo "  kubectl get service frontend-service -n $NAMESPACE"
echo ""
echo "  # View pods"
echo "  kubectl get pods -n $NAMESPACE"
echo ""
echo "  # View logs"
echo "  kubectl logs -l app=backend -n $NAMESPACE --tail=50 -f"
echo ""
echo "  # Scale deployment"
echo "  kubectl scale deployment backend-deployment --replicas=3 -n $NAMESPACE"
echo ""
echo "  # Delete everything"
echo "  kubectl delete namespace $NAMESPACE"
echo ""
echo "🎉 Happy deploying!"
echo ""
