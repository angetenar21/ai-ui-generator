# Kubernetes Manifests Directory

This directory contains all Kubernetes YAML files for deploying your application.

---

## Directory Structure

```
k8s/
├── backend/
│   ├── deployment.yaml          # Backend deployment config
│   ├── service.yaml             # Backend service (ClusterIP)
│   └── secret.yaml.example      # Example secret file
├── frontend/
│   ├── deployment.yaml          # Frontend deployment config
│   └── service.yaml             # Frontend service (LoadBalancer)
└── README.md                    # This file
```

---

## Understanding Each File

### Backend Files

**deployment.yaml**
- Defines how to run backend containers
- Sets replicas: 2 (two copies for high availability)
- Includes health checks (liveness & readiness probes)
- Auto-scaling configuration (HPA)
- Resource limits (CPU & memory)

**service.yaml**
- Creates internal network endpoint
- Type: ClusterIP (not exposed to internet)
- Frontend connects to: `http://backend-service:4000`

**secret.yaml.example**
- Template for secrets (API keys)
- DO NOT use this file directly
- Create secrets with kubectl command instead

### Frontend Files

**deployment.yaml**
- Defines how to run frontend (Nginx) containers
- Sets replicas: 2
- Includes health checks
- Auto-scaling configuration
- Lighter resource limits (static files)

**service.yaml**
- Creates external network endpoint
- Type: LoadBalancer (gets public IP)
- This is how users access your app

---

## Before Deploying

### 1. Update Docker Image Names

Edit these files and replace `YOUR_DOCKERHUB_USERNAME`:

**backend/deployment.yaml (line 29):**
```yaml
image: YOUR_DOCKERHUB_USERNAME/ai-ui-backend:latest
```

**frontend/deployment.yaml (line 22):**
```yaml
image: YOUR_DOCKERHUB_USERNAME/ai-ui-frontend:latest
```

### 2. Create Namespace

```bash
kubectl create namespace ai-ui
```

### 3. Create Secrets

```bash
kubectl create secret generic backend-secrets \
  --from-literal=GEMINI_API_KEY=your_actual_api_key_here \
  -n ai-ui
```

Verify:
```bash
kubectl get secrets -n ai-ui
```

---

## Deployment Commands

### Deploy Everything

```bash
# Deploy backend
kubectl apply -f backend/ -n ai-ui

# Deploy frontend
kubectl apply -f frontend/ -n ai-ui

# Check status
kubectl get all -n ai-ui
```

### Deploy Individually

```bash
# Backend only
kubectl apply -f backend/deployment.yaml -n ai-ui
kubectl apply -f backend/service.yaml -n ai-ui

# Frontend only
kubectl apply -f frontend/deployment.yaml -n ai-ui
kubectl apply -f frontend/service.yaml -n ai-ui
```

---

## Verification

### Check Deployments

```bash
kubectl get deployments -n ai-ui
```

Expected output:
```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
backend-deployment    2/2     2            2           2m
frontend-deployment   2/2     2            2           2m
```

### Check Pods

```bash
kubectl get pods -n ai-ui
```

Expected output:
```
NAME                                   READY   STATUS    RESTARTS   AGE
backend-deployment-abc123-def45        1/1     Running   0          2m
backend-deployment-abc123-ghi67        1/1     Running   0          2m
frontend-deployment-xyz890-jkl12       1/1     Running   0          2m
frontend-deployment-xyz890-mno34       1/1     Running   0          2m
```

### Check Services

```bash
kubectl get services -n ai-ui
```

Expected output:
```
NAME               TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
backend-service    ClusterIP      10.X.X.X        <none>          4000/TCP       2m
frontend-service   LoadBalancer   10.X.X.X        35.X.X.X        80:30080/TCP   2m
```

**Note:** EXTERNAL-IP for frontend may show `<pending>` for 2-3 minutes.

---

## Accessing Your Application

### Get External IP

```bash
kubectl get service frontend-service -n ai-ui
```

Look for the `EXTERNAL-IP` column.

### Access in Browser

```
http://EXTERNAL_IP
```

### Test Backend (Internal)

```bash
# Port-forward to access backend locally
kubectl port-forward service/backend-service 4000:4000 -n ai-ui

# In another terminal
curl http://localhost:4000/health
```

---

## Updating Deployments

### After Code Changes

1. Build new Docker image:
```bash
docker build -t YOUR_USERNAME/ai-ui-backend:v2 .
docker push YOUR_USERNAME/ai-ui-backend:v2
```

2. Update deployment:
```bash
kubectl set image deployment/backend-deployment \
  backend=YOUR_USERNAME/ai-ui-backend:v2 \
  -n ai-ui
```

3. Watch rollout:
```bash
kubectl rollout status deployment/backend-deployment -n ai-ui
```

### Rollback if Issues

```bash
kubectl rollout undo deployment/backend-deployment -n ai-ui
```

---

## Scaling

### Manual Scaling

```bash
# Scale backend to 3 replicas
kubectl scale deployment backend-deployment --replicas=3 -n ai-ui

# Scale frontend to 5 replicas
kubectl scale deployment frontend-deployment --replicas=5 -n ai-ui
```

### Auto-Scaling

Already configured in deployment.yaml:
- **Backend:** 2-5 replicas (based on CPU usage)
- **Frontend:** 2-10 replicas (based on CPU usage)

Check HPA status:
```bash
kubectl get hpa -n ai-ui
```

---

## Viewing Logs

### Backend Logs

```bash
# All backend pods
kubectl logs -l app=backend -n ai-ui --tail=100 -f

# Specific pod
kubectl logs POD_NAME -n ai-ui -f
```

### Frontend Logs

```bash
kubectl logs -l app=frontend -n ai-ui --tail=100 -f
```

---

## Troubleshooting

### Pods Not Starting

```bash
# Describe pod to see events
kubectl describe pod POD_NAME -n ai-ui

# Common issues:
# - ImagePullBackOff: Wrong image name or not pushed to registry
# - CrashLoopBackOff: Container starts but crashes (check logs)
# - Pending: Not enough resources (scale down or add nodes)
```

### Service Not Accessible

```bash
# Check service
kubectl describe service frontend-service -n ai-ui

# Check endpoints
kubectl get endpoints -n ai-ui

# Test from inside cluster
kubectl run test-pod --image=busybox -it --rm -n ai-ui -- sh
# Inside pod:
wget -O- http://backend-service:4000/health
```

### Secret Not Found

```bash
# List secrets
kubectl get secrets -n ai-ui

# Recreate if missing
kubectl create secret generic backend-secrets \
  --from-literal=GEMINI_API_KEY=your_key \
  -n ai-ui
```

---

## Cleanup

### Delete Everything in Namespace

```bash
kubectl delete namespace ai-ui
```

### Delete Specific Resources

```bash
kubectl delete -f backend/ -n ai-ui
kubectl delete -f frontend/ -n ai-ui
```

---

## Best Practices

✅ **Always use namespaces** - Keeps things organized
✅ **Use labels** - Makes filtering and selection easier
✅ **Set resource limits** - Prevents one app from using all resources
✅ **Use health checks** - Kubernetes auto-restarts unhealthy pods
✅ **Enable auto-scaling** - Handles traffic spikes automatically
✅ **Use secrets for sensitive data** - Never hardcode API keys
✅ **Version your images** - Use tags like `v1.0.0` instead of only `latest`

---

## Next Steps

1. **Setup Ingress** - Use domain names instead of IP addresses
2. **Add SSL/TLS** - HTTPS with Let's Encrypt
3. **Setup Monitoring** - Prometheus + Grafana
4. **CI/CD Pipeline** - Auto-deploy on git push
5. **Backup & Restore** - Velero for disaster recovery
