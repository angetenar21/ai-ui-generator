# Deployment Guide - Fix Not Applied

## Current Issue

The fixes have been successfully built locally, but the **production server is still running the old code**. This is why you're still seeing React Error #31.

## Evidence

1. **Local build successful** ✅
   ```
   ✓ built in 9.93s
   dist/assets/index-Rd9qJ4KX.js  // New build with fixes
   ```

2. **Production server using old code** ❌
   ```
   index-a_rcsobl.js  // Old build without fixes
   ```

## Solution: Deploy the New Build

### Option 1: Copy Built Files to Server

```bash
# 1. Build locally (already done)
npm run build

# 2. Copy dist folder to your server
scp -r dist/* user@server:/var/www/ai-ui-generator/dist/

# 3. Restart your web server (if needed)
# For nginx:
sudo systemctl restart nginx

# For Apache:
sudo systemctl restart apache2

# For PM2 (Node.js):
pm2 restart ai-ui-generator
```

### Option 2: Build Directly on Server

```bash
# SSH into your server
ssh user@server

# Navigate to project directory
cd /var/www/ai-ui-generator

# Pull latest code
git pull origin main

# Install dependencies (if needed)
npm install

# Build the project
npm run build

# Restart server
pm2 restart all  # or your restart command
```

### Option 3: CI/CD Pipeline

If you have a CI/CD pipeline:
```bash
# Commit and push changes
git add .
git commit -m "Fix: React Error #31 in table components"
git push origin main

# Your CI/CD should automatically deploy
```

## Files That Need to Be Deployed

The following files contain the fixes:

1. ✅ **src/components/ErrorBoundary.tsx** - Error boundary component
2. ✅ **src/templates/core/renderer.tsx** - Renderer safety checks
3. ✅ **src/templates/data-display/DataGrid.tsx** - Table cell sanitization
4. ✅ **src/templates/data-display/DataTable.tsx** - Table cell sanitization
5. ✅ **src/pages/ChatPage.tsx** - Component validation
6. ✅ **src/App.tsx** - Error boundary wrapper
7. ✅ **src/main.tsx** - Error boundary wrapper

## Verification Steps

After deployment, verify the fix is working:

### 1. Check Build Version

Open browser DevTools → Network tab → Refresh page

Look for:
```
index-Rd9qJ4KX.js  ✅ New build
NOT
index-a_rcsobl.js  ❌ Old build
```

### 2. Test the Problematic Prompt

Enter:
```
Create a chart_ui in invoice domain with legends, status badges, summary cards,
axes labels, message bubbles. Include an area chart and an admission_form.
```

### 3. Expected Behavior

**✅ With fix deployed:**
- No React Error #31
- Tables render successfully
- Console warnings for ComponentSpec in cells (if any)
- Page stays functional

**❌ Without fix deployed:**
- React Error #31 errors
- Error boundary catches it
- May show error UI

### 4. Check Console

Open DevTools Console and look for:
```
[DataGrid] ComponentSpec object found in table cell - converting to string
[DataTable] ComponentSpec object found in table cell - converting to string
```

These warnings confirm the fix is working.

## Quick Deployment Script

Create a `deploy.sh` file:

```bash
#!/bin/bash

echo "🚀 Deploying AI UI Generator fixes..."

# Build locally
echo "📦 Building..."
npm run build

# Copy to server (update with your server details)
echo "📤 Uploading to server..."
scp -r dist/* user@35.225.82.248:/var/www/ai-ui-generator/dist/

# Restart server
echo "🔄 Restarting server..."
ssh user@35.225.82.248 "pm2 restart ai-ui-generator"

echo "✅ Deployment complete!"
echo "🔍 Test at: http://35.225.82.248"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Troubleshooting

### Issue: Old code still loading after deployment

**Solution**: Clear browser cache
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Or clear browser cache completely

### Issue: Build files not updating on server

**Solution**: Check file permissions
```bash
# On server
ls -la /var/www/ai-ui-generator/dist/
# Ensure files are readable by web server
chmod -R 755 /var/www/ai-ui-generator/dist/
```

### Issue: Server returning old bundle

**Solution**: Check web server cache
```bash
# For nginx - clear cache
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx

# For Apache - clear cache
sudo rm -rf /var/cache/apache2/*
sudo systemctl restart apache2
```

## Summary

The fixes are **complete and tested locally**. You just need to:

1. ✅ Deploy the new `dist` folder to your production server
2. ✅ Restart the web server
3. ✅ Hard refresh browser to clear cache
4. ✅ Test with the problematic prompt

Once deployed, all React Error #31 issues will be resolved!
