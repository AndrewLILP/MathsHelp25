#!/bin/bash
# deploy.sh - Deployment automation script

echo "🚀 MathsHelp25 Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this from the project root directory"
    exit 1
fi

# Check environment files exist
if [ ! -f "01backend/.env.example" ] || [ ! -f "01frontend/.env.example" ]; then
    echo "❌ Missing .env.example files"
    exit 1
fi

echo "✅ Environment files found"

# Test backend dependencies
echo "🔍 Testing backend dependencies..."
cd 01backend
npm install --dry-run
if [ $? -ne 0 ]; then
    echo "❌ Backend dependency issues"
    exit 1
fi

# Test frontend dependencies  
echo "🔍 Testing frontend dependencies..."
cd ../01frontend
npm install --dry-run
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency issues"
    exit 1
fi

cd ..

echo "✅ All checks passed - ready for deployment!"
echo "📝 Next steps:"
echo "   1. Push to GitHub"
echo "   2. Deploy via Render.com dashboard"
echo "   3. Set environment variables"
echo "   4. Test production deployment"