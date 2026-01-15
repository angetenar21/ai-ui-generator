# Docker Hub - Quick Cheat Sheet

## 🚀 Automated Script (Easiest)

```bash
./PUSH-TO-DOCKERHUB.sh
```

This script does everything for you automatically!

---

## 📋 Manual Commands (Step by Step)

### 1. Login to Docker Hub
```bash
docker login
# Enter username and password
```

### 2. Build Images
```bash
# Backend
cd backend && docker build -t ai-ui-backend:latest .

# Frontend
cd .. && docker build -t ai-ui-frontend:latest .
```

### 3. Tag Images
```bash
# Replace YOUR_USERNAME with your Docker Hub username
docker tag ai-ui-backend:latest YOUR_USERNAME/ai-ui-backend:latest
docker tag ai-ui-frontend:latest YOUR_USERNAME/ai-ui-frontend:latest
```

### 4. Push to Docker Hub
```bash
docker push YOUR_USERNAME/ai-ui-backend:latest
docker push YOUR_USERNAME/ai-ui-frontend:latest
```

### 5. Verify
Go to: https://hub.docker.com/repositories

---

## 🔧 Useful Commands

### Check if logged in
```bash
docker info | grep Username
```

### Logout
```bash
docker logout
```

### View local images
```bash
docker images
```

### Remove local image
```bash
docker rmi YOUR_USERNAME/ai-ui-backend:latest
```

### Pull from Docker Hub
```bash
docker pull YOUR_USERNAME/ai-ui-backend:latest
```

---

## ⏱️ Expected Time

- Building backend: ~2-5 minutes
- Building frontend: ~3-7 minutes
- Pushing backend: ~2-5 minutes (depends on internet)
- Pushing frontend: ~1-2 minutes

**Total: ~10-20 minutes**

---

## ✅ Success Indicators

After running commands, you should see:

**Build:**
```
Successfully built abc123def456
Successfully tagged ai-ui-backend:latest
```

**Push:**
```
latest: digest: sha256:abc123... size: 1234
```

**Docker Hub:**
- Two repositories visible at https://hub.docker.com/repositories
- Each showing "latest" tag
- Pull command visible on each repo page

---

## ❌ Common Errors

| Error | Solution |
|-------|----------|
| `denied: requested access` | Run `docker login` |
| `no basic auth credentials` | Login again with access token |
| `no space left on device` | Run `docker system prune -a` |
| `unauthorized` | Check username spelling in tag |

---

## 📝 What You'll Need for Deployment

After successful push, save these:

- Your Docker Hub username: `___________`
- Backend image: `YOUR_USERNAME/ai-ui-backend:latest`
- Frontend image: `YOUR_USERNAME/ai-ui-frontend:latest`

You'll use these in the next deployment step!
