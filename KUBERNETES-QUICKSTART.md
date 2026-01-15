# Kubernetes Deployment - Quick Start Guide

**Complete Kubernetes deployment in ~30 minutes**

---

## ✅ Prerequisites

Before you start:
- [ ] Docker installed and running
- [ ] Docker Hub account created
- [ ] Google Cloud account created (with billing enabled)
- [ ] Your Gemini API key ready

---

## 🚀 Option 1: Automated Deployment (Easiest)

Run this single command and follow the prompts:

```bash
./deploy-to-gke.sh
```

This script will:
1. Build and push Docker images
2. Create GKE cluster
3. Deploy your application
4. Give you the external IP

**That's it!** The script handles everything.

---

## 🔧 Option 2: Manual Deployment (Step by Step)

### Step 1: Push Images to Docker Hub (10 mins)

```bash
# Run the push script
./PUSH-TO-DOCKERHUB.sh

# Or manually:
docker login
cd backend && docker build -t YOUR_USERNAME/ai-ui-backend:latest . && docker push YOUR_USERNAME/ai-ui-backend:latest
cd .. && docker build -t YOUR_USERNAME/ai-ui-frontend:latest . && docker push YOUR_USERNAME/ai-ui-frontend:latest
```

### Step 2: Install gcloud CLI (5 mins)

```bash
# macOS
curl https://sdk.cloud.google.com | bash
exec -l $SHELL  # Restart shell
gcloud init
```

### Step 3: Create GKE Cluster (10 mins)

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable container.googleapis.com compute.googleapis.com

# Create cluster
gcloud container clusters create ai-ui-cluster \
  --zone=us-central1-a \
  --num-nodes=2 \
  --machine-type=e2-small \
  --enable-autoscaling --min-nodes=1 --max-nodes=3
```

### Step 4: Configure kubectl (1 min)

```bash
gcloud container clusters get-credentials ai-ui-cluster --zone=us-central1-a
kubectl get nodes  # Verify connection
```

### Step 5: Update Manifests (2 mins)

Edit `k8s/backend/deployment.yaml` and `k8s/frontend/deployment.yaml`:
- Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username

### Step 6: Create Secrets (1 min)

```bash
kubectl create namespace ai-ui

kubectl create secret generic backend-secrets \
  --from-literal=GEMINI_API_KEY=your_actual_api_key \
  -n ai-ui
```

### Step 7: Deploy (2 mins)

```bash
kubectl apply -f k8s/backend/ -n ai-ui
kubectl apply -f k8s/frontend/ -n ai-ui
```

### Step 8: Get External IP (3 mins)

```bash
kubectl get service frontend-service -n ai-ui --watch
```

Wait for EXTERNAL-IP to appear, then access:
```
http://EXTERNAL_IP
```

---

## 📋 Verification Checklist

After deployment, verify:

```bash
# All pods running?
kubectl get pods -n ai-ui
# Should show: 2 backend pods, 2 frontend pods, all Running

# Services created?
kubectl get services -n ai-ui
# Should show: backend-service (ClusterIP), frontend-service (LoadBalancer with external IP)

# Backend healthy?
kubectl port-forward service/backend-service 4000:4000 -n ai-ui
curl http://localhost:4000/health
# Should return: {"status":"ok",...}

# Frontend accessible?
# Open http://EXTERNAL_IP in browser
# Should show your application
```

---

## 🐛 Troubleshooting

### Pods not starting?

```bash
kubectl describe pod POD_NAME -n ai-ui
kubectl logs POD_NAME -n ai-ui
```

Common issues:
- **ImagePullBackOff**: Wrong Docker Hub username in manifests
- **CrashLoopBackOff**: Missing secrets or environment variables
- **Pending**: Not enough cluster resources (add nodes)

### Can't access frontend?

```bash
# Check service
kubectl get service frontend-service -n ai-ui

# If EXTERNAL-IP is <pending> for >5 minutes:
kubectl describe service frontend-service -n ai-ui
# Check events for errors
```

### Backend errors?

```bash
# View backend logs
kubectl logs -l app=backend -n ai-ui --tail=100

# Common issues:
# - GEMINI_API_KEY not set
# - Backend can't reach Gemini API (network policy?)
```

---

## 💰 Cost Management

### Current Setup Cost

With default configuration (2x e2-small nodes):
- **~$30-40/month** if running 24/7
- Free for first $300 credit (Google Cloud free trial)

### Reduce Costs

```bash
# Scale down when not using
kubectl scale deployment --all --replicas=0 -n ai-ui

# Scale back up
kubectl scale deployment --all --replicas=2 -n ai-ui

# Delete cluster when done
gcloud container clusters delete ai-ui-cluster --zone=us-central1-a
```

### Use Preemptible Nodes (80% cheaper)

```bash
# Create cluster with preemptible nodes
gcloud container clusters create ai-ui-cluster \
  --zone=us-central1-a \
  --num-nodes=2 \
  --machine-type=e2-small \
  --preemptible
```

Note: Preemptible nodes can be shut down anytime (good for dev, not production)

---

## 📚 Next Steps

After successful deployment:

1. **Custom Domain**
   - Point your domain to the LoadBalancer IP
   - Update DNS A record

2. **HTTPS/SSL**
   - Install cert-manager
   - Get free SSL certificate from Let's Encrypt

3. **Monitoring**
   - Setup Google Cloud Monitoring
   - View metrics, logs, alerts

4. **CI/CD**
   - Setup GitHub Actions
   - Auto-deploy on git push

5. **Production Hardening**
   - Add Ingress controller
   - Configure network policies
   - Setup backup/restore

---

## 🆘 Getting Help

### View Logs

```bash
# Backend logs
kubectl logs -l app=backend -n ai-ui --tail=50 -f

# Frontend logs
kubectl logs -l app=frontend -n ai-ui --tail=50 -f
```

### Debugging

```bash
# Get shell inside pod
kubectl exec -it POD_NAME -n ai-ui -- sh

# Test connectivity
kubectl run test --image=busybox -it --rm -n ai-ui -- sh
wget -O- http://backend-service:4000/health
```

### Restart Deployment

```bash
kubectl rollout restart deployment backend-deployment -n ai-ui
kubectl rollout restart deployment frontend-deployment -n ai-ui
```

---

## 🧹 Cleanup

### Delete Everything

```bash
# Delete namespace (removes all resources)
kubectl delete namespace ai-ui

# Delete cluster (stops billing)
gcloud container clusters delete ai-ui-cluster --zone=us-central1-a
```

---

## 📖 Documentation References

- **Main Guide**: [KUBERNETES-DEPLOYMENT-GUIDE.md](KUBERNETES-DEPLOYMENT-GUIDE.md)
- **Manifests README**: [k8s/README.md](k8s/README.md)
- **Docker Guide**: [DOCKER-GUIDE.md](DOCKER-GUIDE.md)

---

## ✨ Success!

If you can access your application via the external IP, **congratulations!** 🎉

You've successfully:
- ✅ Dockerized a full-stack application
- ✅ Deployed to Kubernetes (GKE)
- ✅ Configured auto-scaling
- ✅ Setup proper networking
- ✅ Implemented health checks
- ✅ Used industry-standard practices

This is production-grade deployment knowledge that many developers don't have!

---

**Questions? Issues? Check the troubleshooting section or the detailed guide.**
