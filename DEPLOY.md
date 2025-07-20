# Deploy to Replit.com

## 🚀 **Replit Deployment Guide**

Replit is perfect for your Socket.io multiplayer game! It's free and supports real-time applications.

### **Step 1: Prepare Your Project**
Make sure your `package.json` has the correct start script:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### **Step 2: Deploy to Replit**

1. **Go to Replit.com**
   - Visit https://replit.com
   - Sign up/login (free account)

2. **Create New Repl**
   - Click "Create Repl"
   - Choose "Import from GitHub" 
   - Enter your GitHub repo URL: `https://github.com/nd-tung/chuyen2nguoi`
   - OR choose "Node.js" template and upload your files

3. **Upload Your Files** (if not using GitHub):
   - Drag and drop all your files:
     - `server.js`
     - `index.html` 
     - `script.js`
     - `style.css`
     - `package.json`

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Run Your App**
   - Click the green "Run" button
   - OR type: `npm start`

6. **Get Your URL**
   - Replit will give you a URL like: `https://your-repl-name.your-username.repl.co`
   - Your game is now live!

### **Step 3: Configure (if needed)**

Replit automatically:
- ✅ Sets up Node.js environment
- ✅ Installs dependencies
- ✅ Handles port configuration
- ✅ Supports Socket.io perfectly
- ✅ Keeps your app running

### **Replit Advantages:**
- 🆓 **Free tier available**
- 🔄 **Always-on option** (with paid plan)
- 🌐 **Instant live URL**
- 🛠️ **Built-in code editor**
- 👥 **Perfect for Socket.io multiplayer games**
- 📱 **Mobile-friendly interface**

### **Free Tier Limitations:**
- App may sleep after inactivity
- Limited compute resources
- Upgrade to "Always On" for $7/month if needed

### **Your Game Will Work Perfectly!**
Replit supports persistent server connections, so your Socket.io multiplayer functionality will work exactly as expected.

## 🎮 **Replit Configuration Steps**

Since you're already in Replit, here's how to configure and run your project:

### **Step 1: In Replit Console/Shell**
Run these commands to install dependencies:
```bash
npm install
```

### **Step 2: Set Run Command**
In the Replit interface:
- Change the run command from `npm run dev` to: `node server.js`
- OR click "Confirm and close" if it shows `npm run dev` (it will work fine)

### **Step 3: Run Your Game**
- Click the green "Run" button
- Replit will automatically assign a port and start your server
- You'll see: "🎮 Two Truths and a Lie server listening on port XXXX"

### **Step 4: Access Your Game**
- Replit will show you a URL in the webview panel
- OR click the "Open in new tab" icon to get the full URL
- Share this URL with friends to play together!

### **Expected Output:**
```
🎮 Two Truths and a Lie server listening on port 3000
🌐 Open http://localhost:3000 in your browser
```

### **If You See Errors:**
1. Make sure all files are uploaded (server.js, index.html, script.js, style.css, package.json)
2. Run `npm install` in the Shell tab
3. Check that port 3000 or assigned port is not blocked

Your "Two Truths and a Lie" game will be live in minutes! 🚀
