# Complete GCP Deployment Guide for AI UI Generator

This guide provides comprehensive step-by-step instructions to deploy the AI UI Generator application on Google Cloud Platform using a Compute Engine VM instance.

## 🚀 Quick Start (Using Existing Project)

**Good news!** Since you already have a GCP project with billing enabled, you can skip the billing setup entirely. Here's your simplified path:

1. **Select your existing project** in GCP Console (Step 1)
2. **Enable Compute Engine API** (Step 2) - takes 2 minutes
3. **Create VM Instance** (Step 4-6) - takes 5 minutes
4. **Follow the deployment steps** starting from Step 8

You can jump directly to [VM Instance Creation](#vm-instance-creation) if you're ready!

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [GCP Setup](#gcp-setup)
3. [VM Instance Creation](#vm-instance-creation)
4. [VM Configuration](#vm-configuration)
5. [Application Deployment](#application-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Setting Up Process Management](#setting-up-process-management)
9. [Configuring Firewall Rules](#configuring-firewall-rules)
10. [Setting Up a Domain (Optional)](#setting-up-a-domain-optional)
11. [SSL/HTTPS Setup with Nginx](#sslhttps-setup-with-nginx)
12. [Monitoring and Maintenance](#monitoring-and-maintenance)
13. [Troubleshooting](#troubleshooting)

---

## Your Simplified Deployment Flow

Since you already have a billing-enabled project, here's what you'll actually do:

```
1. Open GCP Console → Select your existing project (1 min)
                    ↓
2. Enable Compute Engine API (2 min)
                    ↓
3. Create VM Instance (5 min)
   - Choose region/zone
   - Select machine type (e2-medium recommended)
   - Choose Ubuntu 22.04 LTS
   - Enable HTTP/HTTPS traffic
                    ↓
4. SSH into VM (1 min)
                    ↓
5. Install Node.js, Git, PM2, Nginx (10 min)
                    ↓
6. Upload/Clone your application (5 min)
                    ↓
7. Install dependencies & build (10 min)
                    ↓
8. Configure environment (.env file) (3 min)
                    ↓
9. Start with PM2 (2 min)
                    ↓
10. Configure Nginx reverse proxy (5 min)
                    ↓
11. Open firewall ports (3 min)
                    ↓
12. Test & Access your app! 🎉
```

**Total time: ~45-50 minutes** (most of it is waiting for installations)

---

## Prerequisites

Before starting, ensure you have:
- A Google Cloud Platform account
- **An existing GCP project with billing already enabled** (you'll use this project)
- Your Gemini API key (from https://makersuite.google.com/app/apikey)
- Basic knowledge of Linux terminal commands
- SSH client installed on your local machine (or use the GCP Console browser SSH)

---

## GCP Setup

### Step 1: Select Your Existing GCP Project

**Since you already have a project with billing enabled, you can skip creating a new project and billing setup!**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. **Select your existing project** that already has billing enabled
4. You're ready to proceed!

**Note:** If you still want to create a new project (optional):
<details>
<summary>Click here for new project creation steps</summary>

1. Click on the project dropdown at the top of the page
2. Click "New Project"
3. Enter project details:
   - **Project name**: `ai-ui-generator` (or your preferred name)
   - **Organization**: Select if applicable
   - **Location**: Choose your organization or "No organization"
4. Click "Create"
5. Wait for the project to be created (this may take a minute)
6. Select your newly created project from the project dropdown
7. Go to **Billing** in the left sidebar
8. Link your existing billing account to this new project
</details>

### Step 2: Enable Required APIs

1. In the GCP Console, make sure you're in the correct project (check the project name at the top)
2. Go to **APIs & Services** > **Library**
3. Search for and enable the following API:
   - **Compute Engine API**
     - Click on "Compute Engine API"
     - Click "Enable"
     - Wait for the API to be enabled (takes 1-2 minutes)

**Note:** Other APIs like Cloud Resource Manager API are usually enabled by default

### Step 3: Verify Billing is Enabled

1. Click on the hamburger menu (≡) in the top left
2. Go to **Billing**
3. You should see your billing account linked
4. If you see "This project has no billing account", click "Link a billing account" and select your existing billing account
5. Verify billing is enabled for your project

**💡 Cost Note:** Since you're using an existing project, you're already set up! VM costs will be:
- **e2-medium (recommended)**: ~$24-30/month if running 24/7
- **e2-small (minimal)**: ~$12-15/month if running 24/7
- **Tip**: You can stop the VM when not in use to save costs (only pay for storage ~$2/month)

---

## VM Instance Creation

### Step 4: Create a Compute Engine VM Instance

1. In the GCP Console, navigate to **Compute Engine** > **VM Instances**
2. If this is your first time, wait for Compute Engine to initialize (2-3 minutes)
3. Click **"Create Instance"** or **"Create"**

### Step 5: Configure VM Instance Settings

#### Basic Configuration

**Name and Region:**
- **Name**: `ai-ui-generator-vm` (or your preferred name)
- **Region**: Choose a region close to your users (e.g., `us-central1`, `us-east1`, `europe-west1`, `asia-southeast1`)
- **Zone**: Select any zone in your chosen region (e.g., `us-central1-a`)

#### Machine Configuration

**Machine family:** General-purpose
**Series:** E2 (cost-effective) or N2 (better performance)
**Machine type:**
- For development/testing: `e2-medium` (2 vCPU, 4 GB memory) - **Recommended to start**
- For production: `e2-standard-2` (2 vCPU, 8 GB memory) or higher

Cost estimate will appear on the right side.

#### Boot Disk

1. Click **"Change"** under Boot disk
2. Configure the following:
   - **Operating System**: Ubuntu
   - **Version**: ⚠️ **IMPORTANT: Ubuntu 22.04 LTS** (NOT 25.10 or any non-LTS version!)
     - Look for "Ubuntu 22.04 LTS x86/64, amd64 jammy"
     - DO NOT select Ubuntu 25.10 or other non-LTS versions (they have compatibility issues)
   - **Boot disk type**: Balanced persistent disk (good balance of cost and performance)
     - Or Standard persistent disk (cheaper)
     - Or SSD persistent disk (faster, more expensive)
   - **Size**: 20 GB (minimum) - 30 GB recommended
3. Click **"Select"**

**Why Ubuntu 22.04 LTS?**
- ✅ Long-term support until 2027
- ✅ Stable and production-ready
- ✅ Compatible with all standard tools
- ✅ Standard sudo implementation (no sudo-rs issues)

#### Identity and API Access

**Service account:** Compute Engine default service account
**Access scopes:**
- Select "Allow default access" or
- Select "Allow full access to all Cloud APIs" (if you plan to use other GCP services)

#### Firewall

Check both boxes:
- ☑️ **Allow HTTP traffic**
- ☑️ **Allow HTTPS traffic**

These create default firewall rules to allow web traffic.

#### Advanced Options (Expand this section)

**Networking:**
1. Click on **"Networking"** tab
2. Under **Network interfaces**, click the default network interface
3. **External IPv4 address**: Select "Ephemeral" (or "Create IP address" for a static IP)
   - For production, create a static IP:
     - Click "Create IP address"
     - Name: `ai-ui-generator-static-ip`
     - Click "Reserve"
4. Click **"Done"**

**Network tags:** (Optional but recommended)
- Add tag: `http-server`
- Add tag: `https-server`

### Step 6: Create the Instance

1. Review all settings
2. Check the monthly cost estimate on the right
3. Click **"Create"**
4. Wait for the VM to be provisioned (1-2 minutes)
5. You'll see your VM in the instances list with a green checkmark when ready

### Step 7: Note Your VM's External IP

1. In the VM instances list, find your instance
2. Look for the **External IP** column
3. Copy this IP address - you'll need it to access your application
4. Example: `34.123.45.67`

---

## VM Configuration

### Step 8: Connect to Your VM via SSH

**✅ RECOMMENDED: Option 1 - Using GCP Console (Easiest, No Setup Required)**

1. In the VM instances list, find your instance `ai-ui-generator-vm`
2. Click the **SSH** button (it looks like a terminal icon) next to your instance
3. A new browser window will open with a black terminal
4. Wait 10-20 seconds for the connection to establish
5. You'll see a command prompt like: `your-username@ai-ui-generator-vm:~$`
6. **You're now connected!** Start running commands from Step 9 onwards.

---

**Alternative Options (Only if you prefer command line on your local machine):**

<details>
<summary>Option 2: Using gcloud CLI (If installed locally)</summary>

```bash
gcloud compute ssh ai-ui-generator-vm --zone=us-central1-a
```
</details>

<details>
<summary>Option 3: Using SSH from your terminal</summary>

```bash
# First, add your SSH key to the VM (do this in GCP Console under Metadata > SSH Keys)
ssh -i ~/.ssh/your-key username@EXTERNAL_IP
```
</details>

### Step 9: Update System Packages

Once connected via SSH, run:

**⚠️ If you get a sudo error ("I'm afraid I can't do that"), try one of these:**

**Option A: Use `su` to become root**
```bash
su -
# Then run commands without sudo
apt update
apt upgrade -y
```

**Option B: Try with full sudo path**
```bash
/usr/bin/sudo apt update
/usr/bin/sudo apt upgrade -y
```

**Option C: Standard approach (if sudo works normally)**
```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y
```

This may take 5-10 minutes.

**Note:** If none work, you may need to recreate the VM. When creating, ensure:
- Use Ubuntu 22.04 LTS (not Container-Optimized OS)
- Don't enable any security restrictions

### Step 10: Install Node.js and npm

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x or higher
```

### Step 11: Install Git

```bash
# Install Git
sudo apt install -y git

# Verify installation
git --version
```

### Step 12: Install Build Tools

```bash
# Install essential build tools (needed for some npm packages)
sudo apt install -y build-essential

# Install Python (needed for some node-gyp builds)
sudo apt install -y python3 python3-pip
```

### Step 13: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 14: Install Nginx (Web Server/Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

## Application Deployment

### 🚀 Quick Git Clone Workflow

**If you have the Git repository URL, here's the fastest path:**

```bash
# 1. Create directory
sudo mkdir -p /var/www/ai-ui-generator
sudo chown -R $USER:$USER /var/www/ai-ui-generator
cd /var/www/ai-ui-generator

# 2. Clone repository (choose one based on your access)

# For PUBLIC repo:
git clone https://github.com/username/repo-name.git .

# For PRIVATE repo with access:
# Option A: Use Personal Access Token
git clone https://YOUR_TOKEN@github.com/username/repo-name.git .

# Option B: Use SSH (after setting up SSH keys)
git clone git@github.com:username/repo-name.git .

# 3. Install dependencies
npm install
cd backend && npm install && cd ..

# 4. Generate schema
npm run generate-schema

# 5. Continue to environment setup (Step 19)
```

---

### Step 15: Create Application Directory

```bash
# Create a directory for your application
sudo mkdir -p /var/www/ai-ui-generator

# Change ownership to your user
sudo chown -R $USER:$USER /var/www/ai-ui-generator

# Navigate to the directory
cd /var/www/ai-ui-generator
```

### Step 16: Clone or Upload Your Application

**✅ RECOMMENDED: Option 1 - Clone from Git Repository**

Since you have access to a Git repository, this is the easiest and cleanest method!

**For Public Repository:**
```bash
# Navigate to application directory
cd /var/www/ai-ui-generator

# Clone the repository
git clone https://github.com/username/repository-name.git .
# Note: The dot (.) at the end clones into current directory
```

**For Private Repository (you have access):**

You have several options:

**Method A: Using Personal Access Token (Easiest for private repos)**
```bash
# First, create a Personal Access Token on GitHub:
# 1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
# 2. Click "Generate new token (classic)"
# 3. Give it a name like "GCP VM Access"
# 4. Select scope: "repo" (Full control of private repositories)
# 5. Click "Generate token"
# 6. Copy the token (you won't see it again!)

# Then clone using the token:
cd /var/www/ai-ui-generator
git clone https://YOUR_TOKEN@github.com/username/repository-name.git .

# Example:
# git clone https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/john/ai-ui-generator.git .
```

**Method B: Using SSH Keys (More secure)**
```bash
# 1. Generate SSH key on VM
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for all prompts (use default location, no passphrase)

# 2. Display the public key
cat ~/.ssh/id_ed25519.pub
# Copy the entire output

# 3. Add to GitHub:
# - Go to GitHub → Settings → SSH and GPG keys → New SSH key
# - Paste the key and save

# 4. Clone the repository
cd /var/www/ai-ui-generator
git clone git@github.com:username/repository-name.git .
```

**Method C: Using GitHub CLI (Alternative)**
```bash
# Install GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y

# Authenticate
gh auth login
# Follow the prompts (choose HTTPS, authenticate via browser)

# Clone
cd /var/www/ai-ui-generator
gh repo clone username/repository-name .
```

---

**Option 2: Upload from Local Machine** (If not using Git)

From your **local machine**, use SCP to upload:
```bash
# Compress your project locally first
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator
tar -czf ai-ui-generator.tar.gz --exclude=node_modules --exclude=.git .

# Upload to VM (replace EXTERNAL_IP with your VM's IP)
gcloud compute scp ai-ui-generator.tar.gz ai-ui-generator-vm:/tmp/ --zone=us-central1-a

# Then on the VM, extract:
cd /var/www/ai-ui-generator
tar -xzf /tmp/ai-ui-generator.tar.gz
rm /tmp/ai-ui-generator.tar.gz
```

**Option 3: Manual Upload via GCP Console**

For small files, you can use the GCP Console's file upload feature in the SSH window.

### Step 17: Install Dependencies

```bash
# Navigate to application directory
cd /var/www/ai-ui-generator

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

This will take several minutes as it downloads all dependencies.

### Step 18: Generate Component Schema

```bash
# Generate the required schema file
npm run generate-schema
```

Verify the schema was created:
```bash
ls -la backend/docs/component-library-schema.json
```

---

## Environment Configuration

### Step 19: Create Environment File

```bash
# Navigate to application directory
cd /var/www/ai-ui-generator

# Create .env file
nano .env
```

### Step 20: Configure Environment Variables

Paste the following into the `.env` file (replace with your actual values):

```env
# Backend API Configuration
# URL for the Express backend server (used by frontend)
# Use your VM's external IP address
VITE_API_BASE_URL=http://YOUR_EXTERNAL_IP:4000

# Backend Configuration (for backend/server.js)
# Port for the Express backend server
BACKEND_PORT=4000

# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: Gemini Model (defaults to gemini-2.5-pro)
GEMINI_MODEL=gemini-2.5-pro

# Node environment
NODE_ENV=production
```

**Important:**
- Replace `YOUR_EXTERNAL_IP` with your VM's actual external IP address
- Replace `your_actual_gemini_api_key_here` with your Gemini API key

Save and exit:
- Press `Ctrl + O` to write the file
- Press `Enter` to confirm
- Press `Ctrl + X` to exit

### Step 21: Verify Environment File

```bash
# Check the file was created correctly
cat .env

# Make sure sensitive data is protected
chmod 600 .env
```

### Step 22: Create Logs Directory

```bash
# Create logs directory for backend
mkdir -p logs

# Set appropriate permissions
chmod 755 logs
```

---

## Running the Application

### Step 23: Build the Frontend

```bash
# Navigate to application directory
cd /var/www/ai-ui-generator

# Build the frontend for production
npm run build
```

This creates a `dist` folder with the compiled frontend assets.

Verify the build:
```bash
ls -la dist/
```

You should see `index.html`, `assets/`, etc.

### Step 24: Test the Backend

```bash
# Test the backend server
npm run backend:dev
```

You should see output like:
```
Backend server running on http://localhost:4000
```

Press `Ctrl + C` to stop the test.

### Step 25: Configure PM2 Ecosystem File

```bash
# Create PM2 ecosystem configuration
nano ecosystem.config.js
```

Paste the following configuration:

```javascript
module.exports = {
  apps: [
    {
      name: 'ai-ui-backend',
      script: './backend/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: 4000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M'
    }
  ]
};
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

## Setting Up Process Management

### Step 26: Start Application with PM2

```bash
# Navigate to application directory
cd /var/www/ai-ui-generator

# Start the application using PM2
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs ai-ui-backend --lines 50
```

### Step 27: Configure PM2 to Start on Boot

```bash
# Generate startup script
pm2 startup

# This will output a command like:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u your-username --hp /home/your-username

# Copy and run the command it outputs
# Then save the PM2 process list
pm2 save
```

### Step 28: Verify Backend is Running

```bash
# Check if backend is responding
curl http://localhost:4000/health

# You should see a JSON response with health information
```

---

## Configuring Firewall Rules

### Step 29: Configure GCP Firewall Rules

**Option 1: Using GCP Console**

1. Go to **VPC Network** > **Firewall** in GCP Console
2. Click **"Create Firewall Rule"**
3. Configure for backend (port 4000):
   - **Name**: `allow-backend-4000`
   - **Direction**: Ingress
   - **Targets**: Specified target tags
   - **Target tags**: `http-server` (or your VM's network tag)
   - **Source IP ranges**: `0.0.0.0/0` (allow from anywhere)
   - **Protocols and ports**:
     - Check "Specified protocols and ports"
     - tcp: `4000`
   - Click **"Create"**

4. Create another rule for frontend (port 3000) if serving directly:
   - **Name**: `allow-frontend-3000`
   - **Direction**: Ingress
   - **Targets**: Specified target tags
   - **Target tags**: `http-server`
   - **Source IP ranges**: `0.0.0.0/0`
   - **Protocols and ports**: tcp: `3000`
   - Click **"Create"**

**Option 2: Using gcloud CLI**

```bash
# Allow backend port 4000
gcloud compute firewall-rules create allow-backend-4000 \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:4000 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=http-server

# Allow frontend port 3000 (if needed)
gcloud compute firewall-rules create allow-frontend-3000 \
  --direction=INGRESS \
  --priority=1000 \
  --network=default \
  --action=ALLOW \
  --rules=tcp:3000 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=http-server
```

### Step 30: Test External Access

```bash
# From your local machine, test the backend
curl http://YOUR_EXTERNAL_IP:4000/health
```

Replace `YOUR_EXTERNAL_IP` with your VM's external IP.

---

## SSL/HTTPS Setup with Nginx

### Step 31: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration for your app
sudo nano /etc/nginx/sites-available/ai-ui-generator
```

Paste the following configuration:

```nginx
# Backend API server
server {
    listen 80;
    server_name YOUR_EXTERNAL_IP;

    # Increase body size for larger requests
    client_max_body_size 10M;

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health endpoint
    location /health {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend static files
    location / {
        root /var/www/ai-ui-generator/dist;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    gzip_disable "MSIE [1-6]\.";
}
```

Replace `YOUR_EXTERNAL_IP` with your VM's external IP address.

Save and exit.

### Step 32: Enable Nginx Configuration

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/ai-ui-generator /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test is successful, reload Nginx
sudo systemctl reload nginx
```

### Step 33: Update Environment Variable for Production

```bash
# Edit .env file
nano /var/www/ai-ui-generator/.env
```

Update the `VITE_API_BASE_URL` to use relative path:
```env
VITE_API_BASE_URL=http://YOUR_EXTERNAL_IP
```

Or for production with domain:
```env
VITE_API_BASE_URL=https://yourdomain.com
```

### Step 34: Rebuild Frontend with Updated Environment

```bash
cd /var/www/ai-ui-generator
npm run build
```

### Step 35: Restart Application

```bash
# Restart PM2 processes
pm2 restart all

# Check status
pm2 status
```

### Step 36: Test the Application

Open your browser and navigate to:
```
http://YOUR_EXTERNAL_IP
```

You should see your AI UI Generator application running!

---

## Setting Up a Domain (Optional)

### Step 37: Reserve a Static IP Address

1. In GCP Console, go to **VPC Network** > **IP Addresses**
2. Click **"Reserve External Static Address"**
3. Configure:
   - **Name**: `ai-ui-generator-ip`
   - **Network Service Tier**: Premium
   - **IP Version**: IPv4
   - **Type**: Regional
   - **Region**: Same as your VM
   - **Attached to**: Select your VM instance
4. Click **"Reserve"**
5. Note the IP address

### Step 38: Configure DNS

1. Go to your domain registrar (e.g., Google Domains, Namecheap, GoDaddy)
2. Add an A record:
   - **Host/Name**: `@` (for root domain) or `app` (for subdomain)
   - **Type**: A
   - **Value/Points to**: Your static IP address
   - **TTL**: 3600 (or default)
3. Save the record
4. Wait for DNS propagation (can take up to 48 hours, usually faster)

### Step 39: Update Nginx Configuration with Domain

```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/ai-ui-generator
```

Update the `server_name` directive:
```nginx
server_name yourdomain.com www.yourdomain.com YOUR_EXTERNAL_IP;
```

Save and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 40: Install SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain and install SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

Certbot will automatically:
- Obtain an SSL certificate
- Configure Nginx for HTTPS
- Set up automatic renewal

### Step 41: Test SSL Certificate

```bash
# Test certificate renewal
sudo certbot renew --dry-run
```

Visit your site:
```
https://yourdomain.com
```

### Step 42: Update Environment for HTTPS

```bash
# Edit .env file
nano /var/www/ai-ui-generator/.env
```

Update:
```env
VITE_API_BASE_URL=https://yourdomain.com
```

Rebuild and restart:
```bash
npm run build
pm2 restart all
```

---

## Monitoring and Maintenance

### Step 43: Monitor Application Logs

```bash
# View PM2 logs
pm2 logs ai-ui-backend

# View backend-specific log file
tail -f /var/www/ai-ui-generator/logs/backend.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Step 44: Monitor System Resources

```bash
# Install htop for better process monitoring
sudo apt install -y htop

# Run htop
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check PM2 status
pm2 status
pm2 monit
```

### Step 45: Set Up Log Rotation

```bash
# Create PM2 log rotation configuration
pm2 install pm2-logrotate

# Configure log rotation (optional)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### Step 46: Enable GCP Monitoring (Optional)

1. In GCP Console, go to **Monitoring**
2. Enable Cloud Monitoring for your project
3. Create dashboards to monitor:
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic
4. Set up alerting policies for critical metrics

### Step 47: Set Up Automated Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-app.sh
```

Paste:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/ai-ui-generator"
APP_DIR="/var/www/ai-ui-generator"
DATE=$(date +%Y%m%d-%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application (excluding node_modules)
tar -czf $BACKUP_DIR/app-$DATE.tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  -C $APP_DIR .

# Keep only last 7 backups
ls -t $BACKUP_DIR/app-*.tar.gz | tail -n +8 | xargs -r rm

echo "Backup completed: app-$DATE.tar.gz"
```

Make executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/backup-app.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e

# Add this line:
0 2 * * * /usr/local/bin/backup-app.sh >> /var/log/backup.log 2>&1
```

### Step 48: Update Application

To update your application in the future:

```bash
# Navigate to app directory
cd /var/www/ai-ui-generator

# Pull latest changes (if using Git)
git pull origin main

# Install any new dependencies
npm install
cd backend && npm install && cd ..

# Rebuild frontend
npm run build

# Restart backend
pm2 restart all

# Check status
pm2 status
```

---

## Troubleshooting

### Issue: Cannot Connect to VM

**Solution:**
```bash
# Check firewall rules
gcloud compute firewall-rules list

# Check VM is running
gcloud compute instances list

# Check SSH connectivity
gcloud compute ssh ai-ui-generator-vm --zone=us-central1-a
```

### Issue: Backend Not Starting

**Solution:**
```bash
# Check PM2 logs
pm2 logs ai-ui-backend --lines 100

# Check environment variables
cat /var/www/ai-ui-generator/.env

# Check if port 4000 is in use
sudo lsof -i :4000

# Manually test backend
cd /var/www/ai-ui-generator
node backend/server.js
```

### Issue: Frontend Shows Blank Page

**Solution:**
```bash
# Check if build was successful
ls -la /var/www/ai-ui-generator/dist/

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx configuration
sudo nginx -t

# Rebuild frontend
cd /var/www/ai-ui-generator
npm run build
```

### Issue: API Calls Failing

**Solution:**
```bash
# Check Gemini API key
grep GEMINI_API_KEY /var/www/ai-ui-generator/.env

# Test backend health
curl http://localhost:4000/health

# Check backend logs
tail -f /var/www/ai-ui-generator/logs/backend.log

# Test from outside
curl http://YOUR_EXTERNAL_IP/health
```

### Issue: Out of Memory

**Solution:**
```bash
# Check memory usage
free -h

# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Restart application
pm2 restart all
```

### Issue: Disk Space Full

**Solution:**
```bash
# Check disk usage
df -h

# Find large files
sudo du -h /var/www/ai-ui-generator | sort -rh | head -20

# Clean npm cache
npm cache clean --force

# Clean old logs
pm2 flush

# Remove old backups
sudo rm -f /var/backups/ai-ui-generator/app-*.tar.gz
```

### Issue: SSL Certificate Issues

**Solution:**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Issue: High CPU Usage

**Solution:**
```bash
# Check what's using CPU
htop

# Check PM2 metrics
pm2 monit

# Restart application
pm2 restart all

# If persistent, consider upgrading VM machine type
```

---

## Security Best Practices

### Step 49: Secure Your Environment File

```bash
# Ensure .env is not readable by others
chmod 600 /var/www/ai-ui-generator/.env

# Add .env to .gitignore if using Git
echo ".env" >> /var/www/ai-ui-generator/.gitignore
```

### Step 50: Set Up Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Enable automatic security updates
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### Step 51: Configure UFW Firewall (Additional Layer)

```bash
# Install UFW
sudo apt install -y ufw

# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow backend port (if needed for direct access)
sudo ufw allow 4000

# Enable UFW
sudo ufw enable

# Check status
sudo ufw status
```

### Step 52: Limit SSH Access (Optional)

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Make these changes:
# PermitRootLogin no
# PasswordAuthentication no (use SSH keys only)
# Port 2222 (change from default 22)

# Restart SSH
sudo systemctl restart sshd
```

---

## Cost Optimization

### Step 53: Monitor Costs

1. Go to **Billing** > **Reports** in GCP Console
2. Set up budget alerts:
   - Go to **Billing** > **Budgets & Alerts**
   - Click **"Create Budget"**
   - Set budget amount and alert thresholds

### Step 54: Use Preemptible/Spot VMs (For Non-Production)

For development environments, consider using preemptible VMs to reduce costs:
1. Stop your current instance
2. Create a snapshot
3. Create a new instance with "Preemptible VM" option enabled
4. Costs can be up to 80% lower

### Step 55: Schedule VM Shutdown (Optional)

For development, shut down VM when not in use:
```bash
# Create shutdown script
sudo nano /usr/local/bin/schedule-shutdown.sh
```

Add:
```bash
#!/bin/bash
# Shutdown at 8 PM every day
sudo shutdown -h 20:00
```

Or use GCP's Instance Schedules feature.

---

## Conclusion

Your AI UI Generator is now deployed on Google Cloud Platform!

**Access your application:**
- HTTP: `http://YOUR_EXTERNAL_IP`
- HTTPS (if configured): `https://yourdomain.com`

**Important URLs:**
- Frontend: `http://YOUR_EXTERNAL_IP/`
- Backend Health: `http://YOUR_EXTERNAL_IP/health`
- Backend API: `http://YOUR_EXTERNAL_IP/api/`

**Next Steps:**
1. Test all functionality thoroughly
2. Set up monitoring and alerts
3. Configure automated backups
4. Consider setting up a CI/CD pipeline for automatic deployments
5. Monitor costs and optimize as needed

**Useful Commands Reference:**
```bash
# Check application status
pm2 status

# View logs
pm2 logs ai-ui-backend

# Restart application
pm2 restart all

# Check Nginx status
sudo systemctl status nginx

# Reload Nginx configuration
sudo systemctl reload nginx

# Check disk space
df -h

# Check memory
free -h

# Monitor resources
htop
```

For support or issues, refer to the troubleshooting section above.

Happy deploying! 🚀
