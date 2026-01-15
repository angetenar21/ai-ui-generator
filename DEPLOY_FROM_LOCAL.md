# Deploy AI UI Generator from Local Machine to GCP

This guide shows you how to upload your local application code to the GCP VM instance.

## 🎯 Quick Visual Guide: Where to Run Commands

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR MAC (Local Machine)                                   │
│  /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator    │
│                                                             │
│  🖥️  Run commands here that have:                          │
│  • "From your local machine"                               │
│  • "On your Mac"                                           │
│  • Creating archives, uploading files                      │
│  • git push, gcloud scp, etc.                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    (SSH Connection)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  GCP VM (Remote Server)                                     │
│  ai-ui-generator-vm                                         │
│                                                             │
│  🌩️  Run commands here that have:                          │
│  • "Inside the VM"                                         │
│  • "On the VM"                                             │
│  • After SSH connection                                    │
│  • Installing packages, running server, etc.               │
│                                                             │
│  Prompt looks like: username@ai-ui-generator-vm:~$         │
└─────────────────────────────────────────────────────────────┘
```

## 📍 How to Tell Where You Are

**On Your Mac:**
```
manish@Manishs-MacBook-Air ~ %
# or
manish@Manishs-MacBook-Air ai-ui-generator %
```

**Inside the VM (after SSH):**
```
your-username@ai-ui-generator-vm:~$
# The VM hostname is in the prompt!
```

---

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
# - YOUR_VM_ZONE: your VM's zone (check with: gcloud compute instances list)
gcloud compute scp ai-ui-generator.tar.gz ai-ui-generator-vm:/tmp/ --zone=YOUR_VM_ZONE

# This will take a few minutes depending on your internet speed
```

### Step 5: SSH into VM and Extract

```bash
# SSH into your VM (replace the zone with your actual VM zone)
# Check your VM's zone first with: gcloud compute instances list
gcloud compute ssh ai-ui-generator-vm --zone=YOUR_VM_ZONE
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
# Get your VM's external IP (replace YOUR_VM_ZONE with actual zone)
gcloud compute instances describe ai-ui-generator-vm \
  --zone=YOUR_VM_ZONE \
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
# SSH into VM (replace YOUR_VM_ZONE with actual zone)
gcloud compute ssh ai-ui-generator-vm --zone=YOUR_VM_ZONE

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

### Step 1A: Create GitHub Repository

**🌐 Do this in your WEB BROWSER:**

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `ai-ui-generator`
   - **Description**: AI UI Generator Application
   - **Visibility**: Choose Private or Public
   - **DO NOT** initialize with README, .gitignore, or license
4. Click **"Create repository"**
5. **Copy the repository URL** shown (e.g., `https://github.com/YOUR_USERNAME/ai-ui-generator.git`)

---

### Step 1B: Push Code to GitHub

**🖥️ Run these commands on YOUR LOCAL MAC:**

Open Terminal on your Mac and run:

```bash
# Navigate to your project
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-ui-generator.git

# Push to GitHub
git push -u origin main
```

**If you get an error about authentication:**
- GitHub may ask for your username and password
- **Important:** You need to use a Personal Access Token instead of your password
- Follow the prompts or see the authentication section below

---

### Step 1C: Verify Upload

**🌐 In your WEB BROWSER:**

1. Go to `https://github.com/YOUR_USERNAME/ai-ui-generator`
2. You should see all your files uploaded
3. Now you're ready to clone on the VM!

### Step 2A: SSH into VM

**🖥️ Run this on YOUR LOCAL MAC:**

```bash
# This command connects you from your Mac to the VM (replace YOUR_VM_ZONE with actual zone)
gcloud compute ssh ai-ui-generator-vm --zone=YOUR_VM_ZONE
```

After running this, your terminal prompt will change to something like:
```
your-username@ai-ui-generator-vm:~$
```

This means you're now **inside the VM**!

---

### Step 2B: Clone and Setup on VM

**🌩️ Run these commands INSIDE THE VM (after SSH connection):**

Your terminal should show: `your-username@ai-ui-generator-vm:~$`

```bash
# Create directory
sudo mkdir -p /var/www/ai-ui-generator
sudo chown -R $USER:$USER /var/www/ai-ui-generator

# Navigate to the directory
cd /var/www/ai-ui-generator

# Clone repository (replace YOUR_USERNAME with actual GitHub username)
git clone https://github.com/YOUR_USERNAME/ai-ui-generator.git .

# Install dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Generate schema
npm run generate-schema
```

---

### Step 2C: Verify Everything Worked

**🌩️ Still inside the VM, run:**

```bash
# Check files are there
ls -la

# You should see:
# - package.json
# - src/
# - backend/
# - etc.

# Check Node.js is working
node --version

# Check schema was generated
ls -la backend/docs/component-library-schema.json
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

### SSH Connection Timeout

If you get "Connection timed out" error:

```bash
# Check if SSH firewall rule exists
gcloud compute firewall-rules list --filter="name:default-allow-ssh"

# If no SSH rule exists, create it
gcloud compute firewall-rules create allow-ssh \
  --allow tcp:22 \
  --source-ranges 0.0.0.0/0 \
  --description="Allow SSH from anywhere"

# Wait 30 seconds, then retry SSH
gcloud compute ssh ai-ui-generator-vm --zone=us-central1-f
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
