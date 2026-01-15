# Kubernetes Deployment Guide - Complete Tutorial

This is a comprehensive guide to deploying your application to Google Kubernetes Engine (GKE).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Container Registry](#phase-1-container-registry)
3. [Phase 2: Google Cloud Setup](#phase-2-google-cloud-setup)
4. [Phase 3: GKE Cluster Creation](#phase-3-gke-cluster-creation)
5. [Phase 4: Kubernetes Manifests](#phase-4-kubernetes-manifests)
6. [Phase 5: Deployment](#phase-5-deployment)
7. [Phase 6: Networking & Access](#phase-6-networking--access)
8. [Phase 7: Secrets & Environment Variables](#phase-7-secrets--environment-variables)
9. [Verification & Testing](#verification--testing)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- ✅ Docker (already installed)
- ⬜ Google Cloud SDK (`gcloud`)
- ⬜ kubectl (Kubernetes command-line tool)
- ⬜ Docker Hub account (or Google Artifact Registry)

### Knowledge Requirements

- Basic understanding of containers (you have this!)
- Terminal/command line comfort
- Basic YAML syntax (we'll explain as we go)

---

## Phase 1: Container Registry

### Step 1: Push to Docker Hub

**Why:** Kubernetes needs to pull your images from a registry.

```bash
# Login to Docker Hub
docker login

# Build images
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator/backend
docker build -t ai-ui-backend:latest .

cd ..
docker build -t ai-ui-frontend:latest .

# Tag for Docker Hub (replace YOUR_USERNAME)
docker tag ai-ui-backend:latest YOUR_USERNAME/ai-ui-backend:latest
docker tag ai-ui-frontend:latest YOUR_USERNAME/ai-ui-frontend:latest

# Push to Docker Hub
docker push YOUR_USERNAME/ai-ui-backend:latest
docker push YOUR_USERNAME/ai-ui-frontend:latest
```

**Expected time:** 10-15 minutes

**Verification:**
- Visit https://hub.docker.com/repositories
- Confirm both images are visible

---

## Phase 2: Google Cloud Setup

### Step 2.1: Install Google Cloud SDK

**macOS:**
```bash
# Download and install
curl https://sdk.cloud.google.com | bash

# Restart your terminal, then initialize
gcloud init
```

**Verify installation:**
```bash
gcloud --version
```

Expected output:
```
Google Cloud SDK 456.0.0
bq 2.0.99
core 2024.01.12
gcloud 456.0.0
```

### Step 2.2: Create Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (replace PROJECT_ID with your choice, e.g., "ai-ui-prod")
gcloud projects create PROJECT_ID --name="AI UI Generator"

# Set as default project
gcloud config set project PROJECT_ID

# Enable billing (you'll need to link a billing account via console)
# Go to: https://console.cloud.google.com/billing
```

**Note:** You'll need a credit card, but Google gives $300 free credit for new accounts.

### Step 2.3: Enable Required APIs

```bash
# Enable GKE API
gcloud services enable container.googleapis.com

# Enable Compute Engine API
gcloud services enable compute.googleapis.com

# Enable Container Registry API (if using GCR instead of Docker Hub)
gcloud services enable containerregistry.googleapis.com
```

**Expected time:** 5-10 minutes

---

## Phase 3: GKE Cluster Creation

### Step 3.1: Choose Cluster Configuration

**For learning/development (cheaper):**
```bash
gcloud container clusters create ai-ui-cluster \
  --zone=us-central1-a \
  --num-nodes=2 \
  --machine-type=e2-small \
  --disk-size=10GB \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=3
```

**Cost:** ~$30-40/month (with 2 small nodes)

**For production (recommended):**
```bash
gcloud container clusters create ai-ui-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --machine-type=e2-medium \
  --disk-size=20GB \
  --enable-autoscaling \
  --min-nodes=2 \
  --max-nodes=5 \
  --enable-autorepair \
  --enable-autoupgrade
```

**Cost:** ~$80-120/month

**What this does:**
- `--zone`: Where your cluster runs (choose closest to you)
- `--num-nodes`: Number of worker machines
- `--machine-type`: Size of each machine
- `--enable-autoscaling`: Automatically add/remove nodes based on load
- `--enable-autorepair`: Auto-fix broken nodes
- `--enable-autoupgrade`: Auto-update Kubernetes version

**Expected time:** 5-10 minutes for cluster to be ready

### Step 3.2: Configure kubectl

```bash
# Get credentials for your cluster
gcloud container clusters get-credentials ai-ui-cluster --zone=us-central1-a

# Verify connection
kubectl get nodes
```

**Expected output:**
```
NAME                                          STATUS   ROLES    AGE   VERSION
gke-ai-ui-cluster-default-pool-abc123-def4   Ready    <none>   2m    v1.28.3-gke.1286000
gke-ai-ui-cluster-default-pool-abc123-ghi5   Ready    <none>   2m    v1.28.3-gke.1286000
```

**If you see this, you're connected!** ✅

---

## Phase 4: Kubernetes Manifests

Now we create YAML files that describe how to deploy your app.

### Understanding Kubernetes Objects

- **Deployment:** Manages your app containers (replicas, updates, rollbacks)
- **Service:** Network endpoint to access your app
- **ConfigMap:** Non-sensitive configuration (API URLs, etc.)
- **Secret:** Sensitive data (API keys, passwords)
- **Ingress:** External access with domain names (advanced)

### File Structure

We'll create these files:
```
k8s/
├── backend/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── secret.yaml
└── frontend/
    ├── deployment.yaml
    └── service.yaml
```

---

## Phase 5: Deployment

### Step 5.1: Create Kubernetes Manifests

(See the k8s/ directory - we'll create these next)

### Step 5.2: Apply Manifests

```bash
# Create namespace (optional but recommended)
kubectl create namespace ai-ui

# Apply backend configs
kubectl apply -f k8s/backend/ -n ai-ui

# Apply frontend configs
kubectl apply -f k8s/frontend/ -n ai-ui

# Check status
kubectl get all -n ai-ui
```

---

## Phase 6: Networking & Access

### Step 6.1: Expose Services

Backend will be ClusterIP (internal only).
Frontend will be LoadBalancer (external access).

### Step 6.2: Get External IP

```bash
# Wait for external IP to be assigned (may take 2-3 minutes)
kubectl get service frontend-service -n ai-ui --watch

# Once you see an EXTERNAL-IP, press Ctrl+C
```

**Access your app:**
```
http://EXTERNAL_IP
```

---

## Phase 7: Secrets & Environment Variables

### Create Secret for Backend

```bash
# Create secret with your Gemini API key
kubectl create secret generic backend-secrets \
  --from-literal=GEMINI_API_KEY=your_actual_api_key_here \
  -n ai-ui

# Verify
kubectl get secrets -n ai-ui
```

---

## Verification & Testing

### Check Pod Status

```bash
# See all pods
kubectl get pods -n ai-ui

# Expected output:
NAME                                READY   STATUS    RESTARTS   AGE
backend-deployment-abc123-def45     1/1     Running   0          2m
backend-deployment-abc123-ghi67     1/1     Running   0          2m
frontend-deployment-xyz890-jkl12    1/1     Running   0          2m
```

### View Logs

```bash
# Backend logs
kubectl logs -l app=backend -n ai-ui --tail=50 -f

# Frontend logs
kubectl logs -l app=frontend -n ai-ui --tail=50 -f
```

### Test Backend Health

```bash
# Port-forward to test backend locally
kubectl port-forward service/backend-service 4000:4000 -n ai-ui

# In another terminal
curl http://localhost:4000/health
```

---

## Troubleshooting

### Pods not starting?

```bash
# Describe pod to see errors
kubectl describe pod POD_NAME -n ai-ui

# Common issues:
# - Image pull error: Check image name in deployment.yaml
# - CrashLoopBackOff: Check logs with kubectl logs
# - Pending: Not enough resources in cluster
```

### Can't access frontend?

```bash
# Check service
kubectl get service frontend-service -n ai-ui

# Check firewall rules (GKE usually handles this)
gcloud compute firewall-rules list
```

### Out of resources?

```bash
# Scale down
kubectl scale deployment backend-deployment --replicas=1 -n ai-ui

# Or add more nodes to cluster
gcloud container clusters resize ai-ui-cluster --num-nodes=3 --zone=us-central1-a
```

---

## Cost Management

### Check Current Costs

- Go to: https://console.cloud.google.com/billing
- View: "Cost table" and "Cost breakdown"

### Reduce Costs

```bash
# Scale down when not using
kubectl scale deployment --all --replicas=0 -n ai-ui

# Delete cluster when done learning
gcloud container clusters delete ai-ui-cluster --zone=us-central1-a
```

### Free Tier Tips

- Use `e2-micro` machines (cheaper)
- Use 1-2 nodes instead of 3
- Delete cluster when not in use
- Use `preemptible` nodes (can be shut down, but 80% cheaper)

---

## Next Steps

After successful deployment:

1. **Setup Domain:** Point your domain to the LoadBalancer IP
2. **SSL/TLS:** Add HTTPS with cert-manager
3. **Monitoring:** Setup Google Cloud Monitoring
4. **CI/CD:** Automate deployments with GitHub Actions
5. **Helm:** Package your app for easier management

---

## Important Commands Reference

```bash
# View everything in namespace
kubectl get all -n ai-ui

# Delete everything in namespace
kubectl delete namespace ai-ui

# Restart deployment (rolling restart)
kubectl rollout restart deployment backend-deployment -n ai-ui

# View cluster info
kubectl cluster-info

# View resource usage
kubectl top nodes
kubectl top pods -n ai-ui

# Delete cluster (stops billing)
gcloud container clusters delete ai-ui-cluster --zone=us-central1-a
```

---

**Ready to proceed? Let's start with Phase 1!**
