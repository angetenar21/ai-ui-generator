# GCP Deployment Checklist - Simple Step by Step

Follow this checklist in order. Each step tells you EXACTLY where to run the command.

## ✅ Pre-Deployment (Do Once)

### 1. Create VM Instance
**WHERE:** GCP Console (in your browser)
- [ ] Go to Compute Engine → VM Instances
- [ ] Click "Create Instance"
- [ ] Name: `ai-ui-generator-vm`
- [ ] Region: Choose closest to you
- [ ] Machine type: `e2-medium`
- [ ] Boot disk: **Ubuntu 22.04 LTS** (very important!)
- [ ] Firewall: Check "Allow HTTP traffic" and "Allow HTTPS traffic"
- [ ] Click "Create"
- [ ] Wait for VM to start (green checkmark)
- [ ] Copy the External IP address: `_________________`

---

## 🔧 VM Setup (Do Once)

### 2. Connect to VM
**WHERE:** GCP Console
- [ ] Find your VM in the instances list
- [ ] Click the "SSH" button
- [ ] Wait for terminal to open in browser
- [ ] You should see: `username@ai-ui-generator-vm:~$`

### 3. Update System
**WHERE:** Inside VM (SSH terminal)
Copy and paste each block:

```bash
sudo apt update
sudo apt upgrade -y
```
⏱️ This takes 5-10 minutes. Wait for it to complete.

### 4. Install Node.js
**WHERE:** Inside VM (SSH terminal)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```
✅ You should see: `v20.x.x`

### 5. Install Git
**WHERE:** Inside VM (SSH terminal)

```bash
sudo apt install -y git
git --version
```

### 6. Install Build Tools
**WHERE:** Inside VM (SSH terminal)

```bash
sudo apt install -y build-essential python3
```

### 7. Install PM2
**WHERE:** Inside VM (SSH terminal)

```bash
sudo npm install -g pm2
pm2 --version
```

### 8. Install Nginx
**WHERE:** Inside VM (SSH terminal)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 📦 Deploy Your Code (Choose ONE Method)

### METHOD A: Upload from Local Mac (No Git Needed)

#### Step A1: Create Archive
**WHERE:** On your Mac (Terminal app)

```bash
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator
tar -czf ai-ui-generator.tar.gz --exclude='node_modules' --exclude='dist' --exclude='.git' .
```

#### Step A2: Upload to VM
**WHERE:** On your Mac (Terminal app)

```bash
# Replace us-central1-a with your VM's zone
gcloud compute scp ai-ui-generator.tar.gz ai-ui-generator-vm:/tmp/ --zone=us-central1-a
```

⚠️ **If gcloud command not found:**
- You don't have gcloud CLI installed
- Use METHOD B (Git) instead, or install gcloud

#### Step A3: Extract on VM
**WHERE:** Inside VM (SSH terminal)

```bash
sudo mkdir -p /var/www/ai-ui-generator
sudo chown -R $USER:$USER /var/www/ai-ui-generator
cd /var/www/ai-ui-generator
tar -xzf /tmp/ai-ui-generator.tar.gz
rm /tmp/ai-ui-generator.tar.gz
ls -la
```

✅ You should see package.json, src/, backend/, etc.

**→ Skip METHOD B and go to "Install Dependencies"**

---

### METHOD B: Clone from Git (Recommended)

#### Step B1: Push to GitHub
**WHERE:** On your Mac (Terminal app)

```bash
cd /Users/angetenar/Desktop/intern/gen-ui/ai-ui-generator

# Initialize git (if needed)
git init

# Add files
git add .

# Commit
git commit -m "Deploy to GCP"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-ui-generator.git

# Push (you may need to create the repo on GitHub first)
git push -u origin main
```

📝 **Create GitHub repo first:**
1. Go to github.com
2. Click "+" → "New repository"
3. Name: `ai-ui-generator`
4. Click "Create repository"
5. Use the URL in the commands above

#### Step B2: Clone on VM
**WHERE:** Inside VM (SSH terminal)

```bash
sudo mkdir -p /var/www/ai-ui-generator
sudo chown -R $USER:$USER /var/www/ai-ui-generator
cd /var/www/ai-ui-generator

# Replace YOUR_USERNAME with your GitHub username
git clone https://github.com/YOUR_USERNAME/ai-ui-generator.git .
```

If private repo, you may need to authenticate. See deployment guide for details.

---

## 🏗️ Build and Run

### 9. Install Dependencies
**WHERE:** Inside VM (SSH terminal)

```bash
cd /var/www/ai-ui-generator
npm install
```
⏱️ Takes 3-5 minutes

```bash
cd backend
npm install
cd ..
```
⏱️ Takes 1-2 minutes

### 10. Generate Schema
**WHERE:** Inside VM (SSH terminal)

```bash
npm run generate-schema
ls -la backend/docs/component-library-schema.json
```
✅ File should exist

### 11. Create Environment File
**WHERE:** Inside VM (SSH terminal)

```bash
nano .env
```

Paste this (replace YOUR_EXTERNAL_IP and YOUR_API_KEY):

```env
VITE_API_BASE_URL=http://YOUR_EXTERNAL_IP:4000
BACKEND_PORT=4000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
NODE_ENV=production
```

Save: `Ctrl + O`, `Enter`, `Ctrl + X`

📝 **Your values:**
- External IP: `_________________` (from Step 1)
- Gemini API Key: `_________________` (from Google AI Studio)

### 12. Build Frontend
**WHERE:** Inside VM (SSH terminal)

```bash
npm run build
ls -la dist/
```
✅ You should see dist/ folder with index.html

### 13. Create PM2 Config
**WHERE:** Inside VM (SSH terminal)

```bash
nano ecosystem.config.js
```

Paste:

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

Save: `Ctrl + O`, `Enter`, `Ctrl + X`

### 14. Create Logs Directory
**WHERE:** Inside VM (SSH terminal)

```bash
mkdir -p logs
```

### 15. Start Backend with PM2
**WHERE:** Inside VM (SSH terminal)

```bash
pm2 start ecosystem.config.js
pm2 status
pm2 logs
```

✅ Should show "online" status
Press `Ctrl + C` to exit logs

### 16. Set PM2 to Start on Boot
**WHERE:** Inside VM (SSH terminal)

```bash
pm2 startup
```

Copy the command it outputs and run it, then:

```bash
pm2 save
```

### 17. Test Backend
**WHERE:** Inside VM (SSH terminal)

```bash
curl http://localhost:4000/health
```

✅ Should return JSON health status

---

## 🌐 Configure Nginx

### 18. Create Nginx Config
**WHERE:** Inside VM (SSH terminal)

```bash
sudo nano /etc/nginx/sites-available/ai-ui-generator
```

Paste (replace YOUR_EXTERNAL_IP):

```nginx
server {
    listen 80;
    server_name YOUR_EXTERNAL_IP;

    client_max_body_size 10M;

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

    location /health {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location / {
        root /var/www/ai-ui-generator/dist;
        try_files $uri $uri/ /index.html;

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

Save: `Ctrl + O`, `Enter`, `Ctrl + X`

### 19. Enable Site
**WHERE:** Inside VM (SSH terminal)

```bash
sudo ln -s /etc/nginx/sites-available/ai-ui-generator /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
```

✅ Should say "syntax is ok" and "test is successful"

```bash
sudo systemctl reload nginx
```

---

## 🔥 Configure Firewall

### 20. Open Firewall Ports
**WHERE:** GCP Console (in your browser)

1. Go to **VPC Network** → **Firewall**
2. Click **"Create Firewall Rule"**
3. Name: `allow-backend-4000`
4. Direction: Ingress
5. Targets: Specified target tags
6. Target tags: `http-server`
7. Source IP ranges: `0.0.0.0/0`
8. Protocols and ports: Check "tcp" and enter `4000`
9. Click **"Create"**

---

## 🎉 Test Your Application

### 21. Access Your App
**WHERE:** Your web browser

Open: `http://YOUR_EXTERNAL_IP`

✅ You should see your AI UI Generator!

### 22. Test Backend API
**WHERE:** Your web browser

Open: `http://YOUR_EXTERNAL_IP/health`

✅ You should see JSON health status

### 23. Test the UI Generator
**WHERE:** Your web browser at `http://YOUR_EXTERNAL_IP`

Try generating a UI component to make sure everything works!

---

## 📊 Monitoring

### Check Application Status
**WHERE:** Inside VM (SSH terminal)

```bash
pm2 status
pm2 logs ai-ui-backend
```

### Check Nginx Status
**WHERE:** Inside VM (SSH terminal)

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### View Application Logs
**WHERE:** Inside VM (SSH terminal)

```bash
tail -f /var/www/ai-ui-generator/logs/backend.log
```

---

## 🔄 Updating Your Application (Later)

### If Using Git:
**WHERE:** Inside VM (SSH terminal)

```bash
cd /var/www/ai-ui-generator
git pull
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

### If Using Upload:
Repeat the upload process (Steps A1-A3), then:

```bash
cd /var/www/ai-ui-generator
npm install
cd backend && npm install && cd ..
npm run build
pm2 restart all
```

---

## ⚠️ Troubleshooting

### Backend not starting?
```bash
pm2 logs ai-ui-backend --lines 100
```

### Can't access the app?
- Check firewall rules are created
- Check VM external IP is correct
- Check nginx: `sudo nginx -t`

### App shows errors?
- Check .env file has correct values
- Check Gemini API key is valid
- View logs: `tail -f logs/backend.log`

---

## ✅ Success Checklist

- [ ] VM created with Ubuntu 22.04 LTS
- [ ] All packages installed (Node.js, Git, PM2, Nginx)
- [ ] Code deployed to `/var/www/ai-ui-generator`
- [ ] Dependencies installed (npm install)
- [ ] Schema generated
- [ ] .env file created with correct values
- [ ] Frontend built (dist/ folder exists)
- [ ] Backend running with PM2 (shows "online")
- [ ] Nginx configured and running
- [ ] Firewall ports opened
- [ ] Can access app at `http://YOUR_EXTERNAL_IP`
- [ ] Can access health at `http://YOUR_EXTERNAL_IP/health`
- [ ] UI generator works (can create components)

---

## 🎯 Your Configuration Summary

Fill this out as you go:

```
VM Name: ai-ui-generator-vm
Zone: _________________
External IP: _________________
Gemini API Key: _________________

Application URL: http://_________________
Health Check: http://_________________/health
```

---

Congratulations! Your application is now live on GCP! 🚀
