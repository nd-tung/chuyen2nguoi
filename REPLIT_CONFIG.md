# Replit Configuration Checklist

## ✅ **Before Running - Check These:**

### **1. Files Present:**
- ✅ `server.js` (your Node.js server)
- ✅ `index.html` (game interface)  
- ✅ `script.js` (client-side logic)
- ✅ `style.css` (game styling)
- ✅ `package.json` (dependencies)
- ✅ `.replit` (configuration)

### **2. Install Dependencies:**
```bash
npm install
```

### **3. Run Commands (any of these work):**
```bash
# Option 1: Direct
node server.js

# Option 2: Using npm
npm start

# Option 3: Using npm dev
npm run dev
```

### **4. Expected Success Messages:**
```
🎮 Two Truths and a Lie server listening on port 3000
🌐 Open http://localhost:3000 in your browser
```

## 🚨 **Troubleshooting:**

### **Problem: "Cannot find module 'express'"**
**Solution:** Run `npm install` in the Shell tab

### **Problem: "Port already in use"**  
**Solution:** Replit will automatically assign a free port

### **Problem: "Cannot GET /"**
**Solution:** Make sure `index.html` is in the root directory

### **Problem: Socket.io not connecting**
**Solution:** Check that `script.js` and `socket.io` client are properly loaded

## 🎯 **Ready to Test:**
1. Click "Run" button
2. Wait for "server listening" message
3. Click the URL or webview
4. Test your multiplayer game!

Your Socket.io game will work perfectly on Replit! 🚀
