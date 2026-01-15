# Deploy AI UI Generator from Local Machine to GCP

This guide shows you how to upload your local application code to the GCP VM instance.

## Prerequisites

1. GCP VM instance created and running (Ubuntu 22.04 LTS)
2. gcloud CLI installed on your local machine
3. Your application code at: `/Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator`

---

## Method 1: Using gcloud SCP (Recommended - Easiest)

This method uses Google Cloud's built-in file transfer tool.

### Step 1: Install gcloud CLI (if not already installed)

**On macOS:**
```bash
# Download and install
curl https://sdk.cloud.google.com | bash

# Restart your terminal, then initialize
gcloud init
```

Follow the prompts to:
- Log in to your Google account
- Select your project
- Set default region/zone

### Step 2: Authenticate gcloud

```bash
# Login to your Google account
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Verify it's set correctly
gcloud config list
```

### Step 3: Prepare Your Application for Upload

```bash
# Navigate to your project directory
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator

# Create a compressed archive (excluding node_modules and build files)
tar -czf ai-ui-generator.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='backend/node_modules' \
  --exclude='.git' \
  --exclude='logs' \
  --exclude='.DS_Store' \
  .

# Verify the archive was created
ls -lh ai-ui-generator.tar.gz
```

### Step 4: Upload to VM

```bash
# Upload the archive to your VM
# Replace these values:
# - ai-ui-generator-vm: your VM instance name
# - us-central1-a: your VM's zone
gcloud compute scp ai-ui-generator.tar.gz ai-ui-generator-vm:/tmp/ --zone=us-central1-a

# This will take a few minutes depending on your internet speed
```

### Step 5: SSH into VM and Extract

```bash
# SSH into your VM
gcloud compute ssh ai-ui-generator-vm --zone=us-central1-a
```

Once connected to the VM:

```bash
# Create application directory
sudo mkdir -p /var/www/ai-ui-generator
sudo chown -R $USER:$USER /var/www/ai-ui-generator

# Extract the archive
cd /var/www/ai-ui-generator
tar -xzf /tmp/ai-ui-generator.tar.gz

# Clean up the archive
rm /tmp/ai-ui-generator.tar.gz

# Verify files were extracted
ls -la

# Install dependencies
npm install
cd backend && npm install && cd ..

# Generate schema
npm run generate-schema

# Continue with environment setup (see main deployment guide)
```

---

## Method 2: Using rsync (Faster for Updates)

This method is better if you'll be updating the code frequently.

### Step 1: Install rsync (usually pre-installed on macOS)

```bash
# Check if rsync is installed
rsync --version
```

### Step 2: Get VM's External IP

```bash
# Get your VM's external IP
gcloud compute instances describe ai-ui-generator-vm \
  --zone=us-central1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'

# Save this IP for next step
```

### Step 3: Configure SSH (One-time setup)

```bash
# Generate SSH config for easy access
gcloud compute config-ssh

# This creates SSH config entries for all your VMs
```

### Step 4: Use rsync to Upload

```bash
# Navigate to your project directory
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator

# Sync to VM (excluding node_modules, etc.)
rsync -avz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='backend/node_modules' \
  --exclude='.git' \
  --exclude='logs' \
  --exclude='.env' \
  --progress \
  ./ ai-ui-generator-vm.us-central1-a.YOUR_PROJECT:/var/www/ai-ui-generator/

# Replace YOUR_PROJECT with your actual project ID
```

### Step 5: SSH and Complete Setup

```bash
# SSH into VM
gcloud compute ssh ai-ui-generator-vm --zone=us-central1-a

# Install dependencies
cd /var/www/ai-ui-generator
npm install
cd backend && npm install && cd ..

# Generate schema
npm run generate-schema
```

---

## Method 3: Using SCP Directly (Alternative)

If you prefer traditional SCP:

### Step 1: Configure gcloud SSH

```bash
gcloud compute config-ssh
```

### Step 2: Create and Upload Archive

```bash
# From your local machine
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator

# Create archive
tar -czf ai-ui-generator.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='backend/node_modules' \
  --exclude='.git' \
  .

# Upload using SCP
scp ai-ui-generator.tar.gz ai-ui-generator-vm.us-central1-a.YOUR_PROJECT:/tmp/

# SSH in
ssh ai-ui-generator-vm.us-central1-a.YOUR_PROJECT

# Extract on VM
sudo mkdir -p /var/www/ai-ui-generator
sudo chown -R $USER:$USER /var/www/ai-ui-generator
cd /var/www/ai-ui-generator
tar -xzf /tmp/ai-ui-generator.tar.gz
rm /tmp/ai-ui-generator.tar.gz
```

---

## Method 4: Using Git (Recommended for Future Updates)

The best long-term solution is to push your code to a Git repository first, then clone on the VM.

### Step 1: Push to GitHub/GitLab

```bash
# From your local machine
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for deployment"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/ai-ui-generator.git

# Push
git push -u origin main
```

### Step 2: Clone on VM

```bash
# SSH into VM
gcloud compute ssh ai-ui-generator-vm --zone=us-central1-a

# Create directory
sudo mkdir -p /var/www/ai-ui-generator
sudo chown -R $USER:$USER /var/www/ai-ui-generator

# Clone repository
cd /var/www/ai-ui-generator
git clone https://github.com/YOUR_USERNAME/ai-ui-generator.git .

# Install dependencies
npm install
cd backend && npm install && cd ..

# Generate schema
npm run generate-schema
```

**Benefits of Git method:**
- Easy updates: Just `git pull` on the VM
- Version control
- Can collaborate with others
- Can set up CI/CD later

---

## Quick Comparison

| Method | Speed | Use Case | Complexity |
|--------|-------|----------|------------|
| **gcloud SCP** | Medium | First-time deployment | Easy ⭐ |
| **rsync** | Fast | Frequent updates | Medium |
| **SCP** | Medium | One-time transfer | Easy |
| **Git** | Fast | Best for production | Easy ⭐⭐ |

---

## Recommended Workflow

**For your first deployment:**
1. Use **gcloud SCP** (Method 1) - it's the simplest
2. Upload and get it working
3. Once working, push to Git for easier future updates

**For future updates:**
1. Make changes locally
2. Test locally
3. Push to Git
4. SSH into VM and run `git pull`
5. Restart the application with `pm2 restart all`

---

## After Upload - Continue Deployment

Once your files are on the VM, continue with these steps from the main deployment guide:

1. **Configure environment** (.env file) - Step 19
2. **Build the frontend** - Step 23
3. **Start with PM2** - Step 26
4. **Configure Nginx** - Step 31
5. **Open firewall ports** - Step 29
6. **Test your application** - Step 36

---

## Troubleshooting

### "Permission denied" when using gcloud

```bash
# Re-authenticate
gcloud auth login

# Update gcloud components
gcloud components update
```

### "Instance not found"

```bash
# List your instances
gcloud compute instances list

# Use the exact instance name and zone from the list
```

### Large file upload timeout

```bash
# Increase timeout
gcloud config set compute/scp_timeout 600

# Or split into smaller parts if needed
```

### rsync command not found

```bash
# Install rsync (if needed)
brew install rsync  # macOS
```

---

## Next Steps

After uploading your application, refer back to the main deployment guide (GCP_DEPLOYMENT_GUIDE.md) starting from **Step 19: Create Environment File**.
