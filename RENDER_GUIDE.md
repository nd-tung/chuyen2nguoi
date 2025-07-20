# Render.com Configuration Guide

## 🚀 **Minimal Configuration Required**

Good news! Render auto-detects most settings for Node.js apps. Here's what you need:

### **Required Settings:**
```
Name: your-game-name (anything you want)
Environment: Node
Build Command: npm install
Start Command: npm start
```

### **Optional but Recommended:**
```
Node Version: 18 (or leave blank for auto-detect)
Auto-Deploy: Yes (updates when you push to GitHub)
```

## � **Step-by-Step Render Setup:**

### **Step 1: Basic Setup**
1. Go to https://render.com
2. Sign up with GitHub (free)
3. Click "New +" → **"Web Service"**
4. Connect repository: `https://github.com/nd-tung/chuyen2nguoi`

### **Step 2: Configuration**
```bash
Service Name: two-truths-game
Environment: Node
Region: Oregon (or closest to you)
Branch: master
Build Command: npm install
Start Command: npm start
```

### **Step 3: Environment (Optional)**
- Render automatically sets `PORT` environment variable
- Your code already handles this: `const PORT = process.env.PORT || 3001;`
- **No additional config needed!**

### **Step 4: Deploy**
- Click "Create Web Service"
- Wait 2-3 minutes
- Get your URL: `https://your-game-name.onrender.com`

## ✅ **What Render Handles Automatically:**
- ✅ Port assignment (sets `PORT` environment variable)
- ✅ Node.js version detection
- ✅ Dependency installation
- ✅ SSL certificates (HTTPS)
- ✅ Domain name
- ✅ Server restarts on crashes

## ❌ **No Need To Configure:**
- ❌ Port numbers (Render sets `PORT` automatically)
- ❌ SSL certificates
- ❌ Domain DNS
- ❌ Load balancers
- ❌ Environment setup

## 🎮 **Your Game Will Work Because:**
1. **Port Handling**: Your server uses `process.env.PORT` ✅
2. **Static Files**: Express serves static files correctly ✅ 
3. **Socket.io**: Render supports WebSockets perfectly ✅
4. **Dependencies**: package.json has express and socket.io ✅

## 🚨 **Only Check This:**
Make sure your `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```
*(You already have this!)*

## 📈 **After Deployment:**
- Your game URL: `https://your-game-name.onrender.com`
- Test multiplayer with 2 browser tabs
- Share URL with friends to play!

**That's it! Render handles everything else automatically.** 🚀
