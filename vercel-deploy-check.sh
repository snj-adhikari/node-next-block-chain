#!/bin/bash

# Vercel Deployment Validation Script
# Run this script before deploying to ensure everything is configured correctly

echo "🔍 Vercel Deployment Pre-flight Check"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check results tracking
ALL_CHECKS_PASSED=true

echo ""
echo -e "${BLUE}1. Checking Project Structure...${NC}"

# Check if required files exist
if [ -f "vercel.json" ]; then
    echo -e "✅ vercel.json configuration found"
else
    echo -e "${RED}❌ vercel.json configuration missing${NC}"
    ALL_CHECKS_PASSED=false
fi

if [ -f ".vercelignore" ]; then
    echo -e "✅ .vercelignore file found"
else
    echo -e "${YELLOW}⚠️ .vercelignore file missing (optional)${NC}"
fi

if [ -f ".env.example" ]; then
    echo -e "✅ .env.example template found"
else
    echo -e "${YELLOW}⚠️ .env.example file missing (recommended)${NC}"
fi

# Check frontend structure
if [ -d "frontend" ] && [ -f "frontend/package.json" ] && [ -f "frontend/next.config.js" ]; then
    echo -e "✅ Frontend structure valid"
else
    echo -e "${RED}❌ Frontend structure invalid${NC}"
    ALL_CHECKS_PASSED=false
fi

# Check backend structure
if [ -d "backend" ] && [ -f "backend/package.json" ] && [ -f "backend/src/index.ts" ]; then
    echo -e "✅ Backend structure valid"
else
    echo -e "${RED}❌ Backend structure invalid${NC}"
    ALL_CHECKS_PASSED=false
fi

echo ""
echo -e "${BLUE}2. Checking Dependencies...${NC}"

# Check if node_modules exist
if [ -d "frontend/node_modules" ]; then
    echo -e "✅ Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠️ Frontend dependencies not installed${NC}"
    echo "   Run: cd frontend && npm install"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "✅ Backend dependencies installed"
else
    echo -e "${YELLOW}⚠️ Backend dependencies not installed${NC}"
    echo "   Run: cd backend && npm install"
fi

echo ""
echo -e "${BLUE}3. Testing Build Process...${NC}"

# Test frontend build
echo "Testing frontend build..."
cd frontend
if npm run build > /dev/null 2>&1; then
    echo -e "✅ Frontend builds successfully"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    ALL_CHECKS_PASSED=false
fi
cd ..

# Test backend build
echo "Testing backend build..."
cd backend
if npm run build > /dev/null 2>&1; then
    echo -e "✅ Backend builds successfully"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    ALL_CHECKS_PASSED=false
fi
cd ..

echo ""
echo -e "${BLUE}4. Checking Configuration Files...${NC}"

# Check Next.js config
if grep -q "output.*standalone" frontend/next.config.js; then
    echo -e "✅ Next.js configured for Vercel deployment"
else
    echo -e "${YELLOW}⚠️ Next.js may not be optimally configured for Vercel${NC}"
fi

# Check TypeScript configs
if [ -f "frontend/tsconfig.json" ] && [ -f "backend/tsconfig.json" ]; then
    echo -e "✅ TypeScript configurations found"
else
    echo -e "${YELLOW}⚠️ Some TypeScript configurations missing${NC}"
fi

echo ""
echo -e "${BLUE}5. Validating Package.json Scripts...${NC}"

# Check if build scripts exist
if grep -q "vercel-build" package.json; then
    echo -e "✅ Vercel build script configured"
else
    echo -e "${YELLOW}⚠️ Consider adding 'vercel-build' script${NC}"
fi

echo ""
echo "====================================="

if [ "$ALL_CHECKS_PASSED" = true ]; then
    echo -e "${GREEN}🎉 All critical checks passed! Ready for Vercel deployment.${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repository to Vercel"
    echo "3. Configure environment variables in Vercel Dashboard"
    echo "4. Deploy!"
    echo ""
    echo -e "${BLUE}Quick Deploy Command:${NC}"
    echo "npm run deploy"
else
    echo -e "${RED}❌ Some issues found. Please fix them before deploying.${NC}"
    exit 1
fi
