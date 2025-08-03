#!/bin/bash

echo "🚀 Task Balancer Deployment Helper"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from your project root directory"
    exit 1
fi

echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎯 Ready to deploy! Choose your platform:"
echo ""
echo "1. Railway (Recommended - FREE):"
echo "   npm install -g @railway/cli"
echo "   railway login"
echo "   railway init"
echo "   railway up"
echo ""
echo "2. Render:"
echo "   - Go to render.com"
echo "   - Connect your GitHub repo"
echo "   - Choose 'Deploy from Docker'"
echo ""
echo "3. Fly.io:"
echo "   curl -L https://fly.io/install.sh | sh"
echo "   fly launch"
echo "   fly deploy"
echo ""
echo "📊 Your app features:"
echo "   ✅ SQLite database for persistence"
echo "   ✅ Docker containerization"
echo "   ✅ Production-ready build"
echo "   ✅ Automatic database initialization"
echo ""
echo "🎉 Happy deploying!"
