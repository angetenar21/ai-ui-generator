# Docker Hub Setup & Push Guide

This guide walks you through pushing your Docker images to Docker Hub.

---

## Step 1: Create Docker Hub Account (if you don't have one)

1. Go to https://hub.docker.com/signup
2. Create a free account
3. Verify your email
4. Remember your username (you'll need it!)

---

## Step 2: Login to Docker Hub

Open your terminal and run:

```bash
docker login
```

**What happens:**
- You'll be prompted for your Docker Hub username
- You'll be prompted for your password (or access token)
- You should see: "Login Succeeded"

**Troubleshooting:**
- If login fails, make sure you verified your email
- Consider using an access token instead of password (more secure):
  - Go to https://hub.docker.com/settings/security
  - Click "New Access Token"
  - Use token as password when logging in

---

## Step 3: Build Your Docker Images

### Build Backend Image

```bash
# Navigate to backend directory
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator/backend

# Build the image
docker build -t ai-ui-backend:latest .

# Verify it was created
docker images | grep ai-ui-backend
```

**Expected output:**
```
ai-ui-backend    latest    abc123def456    2 minutes ago    150MB
```

### Build Frontend Image

```bash
# Navigate to project root
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator

# Build the image
docker build -t ai-ui-frontend:latest .

# Verify it was created
docker images | grep ai-ui-frontend
```

**Expected output:**
```
ai-ui-frontend    latest    xyz789ghi012    2 minutes ago    50MB
```

---

## Step 4: Tag Images for Docker Hub

**IMPORTANT:** Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username!

### Tag Backend

```bash
docker tag ai-ui-backend:latest YOUR_DOCKERHUB_USERNAME/ai-ui-backend:latest
```

**Example:**
```bash
# If your username is "johnsmith"
docker tag ai-ui-backend:latest johnsmith/ai-ui-backend:latest
```

### Tag Frontend

```bash
docker tag ai-ui-frontend:latest YOUR_DOCKERHUB_USERNAME/ai-ui-frontend:latest
```

**What this does:**
- Creates a new tag pointing to the same image
- Format: `username/repository:tag`
- `latest` is the version tag (you can use `v1.0.0`, etc.)

### Verify Tags

```bash
docker images
```

You should see both the original and tagged versions:
```
REPOSITORY                           TAG       IMAGE ID       CREATED         SIZE
ai-ui-backend                        latest    abc123def456   5 minutes ago   150MB
YOUR_USERNAME/ai-ui-backend          latest    abc123def456   5 minutes ago   150MB
ai-ui-frontend                       latest    xyz789ghi012   5 minutes ago   50MB
YOUR_USERNAME/ai-ui-frontend         latest    xyz789ghi012   5 minutes ago   50MB
```

Notice the IMAGE ID is the same - it's the same image, just with different names.

---

## Step 5: Push Images to Docker Hub

### Push Backend

```bash
docker push YOUR_DOCKERHUB_USERNAME/ai-ui-backend:latest
```

**What you'll see:**
```
The push refers to repository [docker.io/YOUR_USERNAME/ai-ui-backend]
5f70bf18a086: Pushed
d5a3c8b42e5a: Pushed
...
latest: digest: sha256:abc123... size: 1234
```

This takes a few minutes depending on your internet speed.

### Push Frontend

```bash
docker push YOUR_DOCKERHUB_USERNAME/ai-ui-frontend:latest
```

---

## Step 6: Verify Images on Docker Hub

1. Go to https://hub.docker.com/repositories
2. You should see two repositories:
   - `YOUR_USERNAME/ai-ui-backend`
   - `YOUR_USERNAME/ai-ui-frontend`
3. Click on each to verify the `latest` tag exists

---

## Step 7: Test Pulling Image (Optional)

To verify anyone can pull your image:

```bash
# Remove local image
docker rmi YOUR_DOCKERHUB_USERNAME/ai-ui-backend:latest

# Pull from Docker Hub
docker pull YOUR_DOCKERHUB_USERNAME/ai-ui-backend:latest

# Should download successfully
```

---

## Quick Reference Commands

### Login
```bash
docker login
```

### Build
```bash
# Backend
cd backend && docker build -t ai-ui-backend:latest .

# Frontend
cd .. && docker build -t ai-ui-frontend:latest .
```

### Tag
```bash
docker tag ai-ui-backend:latest YOUR_USERNAME/ai-ui-backend:latest
docker tag ai-ui-frontend:latest YOUR_USERNAME/ai-ui-frontend:latest
```

### Push
```bash
docker push YOUR_USERNAME/ai-ui-backend:latest
docker push YOUR_USERNAME/ai-ui-frontend:latest
```

### Verify
```bash
docker images
```

---

## Common Issues & Solutions

### Issue: "denied: requested access to the resource is denied"
**Solution:**
- Make sure you're logged in: `docker login`
- Check your username is correct in the tag
- Verify repository exists on Docker Hub

### Issue: "no basic auth credentials"
**Solution:**
- Run `docker login` again
- Use access token instead of password

### Issue: Build fails with "no space left on device"
**Solution:**
```bash
# Clean up old images and containers
docker system prune -a

# This frees up space
```

### Issue: Push is very slow
**Solution:**
- This is normal for first push (uploading all layers)
- Subsequent pushes are faster (only changed layers)
- Check your internet connection

---

## Security Best Practices

✅ **Use access tokens** instead of passwords
✅ **Make repositories private** if they contain sensitive code
✅ **Never include secrets** in Docker images (use environment variables)
✅ **Use specific tags** (`v1.0.0`) instead of only `latest` for production

---

## Next Steps

After pushing to Docker Hub, you can:
1. Pull these images on any machine: `docker pull YOUR_USERNAME/ai-ui-backend:latest`
2. Deploy to Google Cloud Run
3. Deploy to any cloud provider
4. Share with your team

---

## Important Notes

- **Free Docker Hub accounts** get unlimited public repositories
- **Private repositories** require a paid plan (or limit of 1 free private repo)
- **Image size matters** - our Alpine-based images are small and fast to push/pull
- **Tags are important** - `latest` auto-updates, versioned tags are stable

---

## Ready for Next Step?

Once you've successfully pushed both images to Docker Hub:
1. Note your Docker Hub username
2. Note the full image names:
   - `YOUR_USERNAME/ai-ui-backend:latest`
   - `YOUR_USERNAME/ai-ui-frontend:latest`

You'll need these when deploying to Google Cloud!
