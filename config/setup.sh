#!/bin/bash

echo "🎮 Setting up Two Truths and a Lie Game..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Make sure the server.js file has correct permissions
chmod +x server.js

# Create logs directory if it doesn't exist
mkdir -p logs

# Check Node.js and npm versions
echo "📋 Environment Information:"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install global packages if needed (optional)
echo "🔧 Installing development tools..."
npm install -g nodemon

# Set up environment variables
echo "🌍 Setting up environment variables..."
echo "NODE_ENV=development" > .env
echo "PORT=8080" >> .env

# Display project information
echo "📁 Project files:"
ls -la

echo ""
echo "🎉 Two Truths and a Lie Game Setup Complete!"
echo ""
echo "🚀 To start the game, run:"
echo "   npm start"
echo ""
echo "🌐 The game will be available at:"
echo "   http://localhost:8080"
echo ""
echo "🎮 Features included:"
echo "   ✅ Bilingual support (English/Vietnamese)"
echo "   ✅ 20 topic categories"
echo "   ✅ Mobile-responsive design"
echo "   ✅ Desktop-optimized interface"
echo "   ✅ Real-time multiplayer gameplay"
echo "   ✅ Enhanced scoreboard with player names"
echo ""