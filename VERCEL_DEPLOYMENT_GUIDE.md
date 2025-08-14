# Vercel Deployment Guide for Blockchain Generator

## 🚀 Quick Deployment Steps

### 1. **Prepare Your Repository**

Ensure your project structure matches:
```
blockchain-generator/
├── frontend/                 # Next.js frontend
├── backend/                  # Node.js/Express backend
├── vercel.json              # Vercel configuration
├── .vercelignore            # Files to ignore during deployment
└── .env.example             # Environment variables template
```

### 2. **Connect to Vercel**

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Connect via GitHub** (recommended):
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your blockchain-generator repository

3. **Or deploy via CLI**:
   ```bash
   cd /Users/snj/creative/blockchain
   vercel
   ```

### 3. **Configure Project Settings**

When importing the project, configure these settings:

#### **Framework Preset**: Other
#### **Root Directory**: `.` (leave empty for root)
#### **Build Command**: 
```bash
cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
```
#### **Output Directory**: `frontend/.next`
#### **Install Command**: 
```bash
npm install --prefix frontend && npm install --prefix backend
```

### 4. **Environment Variables**

Add these environment variables in Vercel Dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `NEXT_PUBLIC_API_URL` | `/api` | API endpoint for frontend |
| `FRONTEND_URL` | `https://your-project.vercel.app` | Your deployed URL |

#### **Setting Environment Variables:**
1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for all environments (Production, Preview, Development)

### 5. **Deployment Configuration Details**

#### **Our `vercel.json` Configuration:**

```json
{
  "version": 2,
  "name": "blockchain-generator",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

**This configuration:**
- ✅ **Builds Next.js frontend** with proper routing
- ✅ **Deploys Node.js backend** as serverless functions
- ✅ **Routes API calls** to backend (`/api/*` → backend)
- ✅ **Routes all other requests** to frontend
- ✅ **Handles CORS** for cross-origin requests

### 6. **Automatic Deployment**

Once connected to GitHub:

✅ **Auto-deploy on push** to main branch  
✅ **Preview deployments** for pull requests  
✅ **Build logs** and error reporting  
✅ **Custom domains** support  

### 7. **Post-Deployment Verification**

After successful deployment, test these endpoints:

#### **Frontend Routes:**
- `https://your-project.vercel.app/` - Landing page
- `https://your-project.vercel.app/create` - Blockchain creation page

#### **API Routes:**
- `https://your-project.vercel.app/api/health` - Health check
- `https://your-project.vercel.app/api/stats` - System statistics
- `https://your-project.vercel.app/api/blockchain/create` - Blockchain creation

### 8. **Troubleshooting Common Issues**

#### **Build Errors:**
- **Issue**: "Module not found" errors
- **Solution**: Ensure all dependencies are in `package.json`
- **Check**: Both `frontend/package.json` and `backend/package.json`

#### **API Not Working:**
- **Issue**: 404 errors for API calls
- **Solution**: Verify `vercel.json` routes configuration
- **Check**: Environment variable `NEXT_PUBLIC_API_URL`

#### **CORS Errors:**
- **Issue**: Cross-origin request blocked
- **Solution**: Set `FRONTEND_URL` environment variable to your Vercel domain
- **Check**: Backend CORS configuration in `app.ts`

#### **Serverless Function Timeout:**
- **Issue**: Function execution time limit
- **Solution**: Optimize blockchain creation/mining logic
- **Check**: `maxDuration` setting in `vercel.json`

### 9. **Performance Optimization**

#### **Frontend Optimization:**
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  compress: true,
  images: {
    domains: ['your-domain.vercel.app'],
  },
}
```

#### **Backend Optimization:**
- **Database**: Use serverless-compatible database (Planetscale, Supabase)
- **Caching**: Implement Redis for blockchain data
- **Files**: Use Vercel Blob for file storage

### 10. **Custom Domain Setup**

1. **Go to Project Settings** → **Domains**
2. **Add your custom domain**
3. **Configure DNS** (A record or CNAME)
4. **Update environment variables** with new domain

### 11. **Monitoring & Analytics**

Enable in Vercel Dashboard:
- ✅ **Web Analytics** - Page views and performance
- ✅ **Speed Insights** - Core Web Vitals monitoring
- ✅ **Function Logs** - Serverless function debugging
- ✅ **Real-time logs** - Live deployment monitoring

---

## 📋 Pre-Deployment Checklist

- [ ] All dependencies installed in both `frontend/` and `backend/`
- [ ] Environment variables configured in Vercel Dashboard
- [ ] `vercel.json` configuration in project root
- [ ] `.vercelignore` excludes unnecessary files
- [ ] Repository connected to Vercel
- [ ] Build commands tested locally
- [ ] API endpoints tested and working
- [ ] CORS configuration matches deployed domain

---

## 🎯 Expected Deployment Outcome

### **Frontend (Next.js)**
- ✅ **Static generation** for optimal performance
- ✅ **Automatic optimization** for images and assets
- ✅ **CDN delivery** for fast global access

### **Backend (Node.js)**
- ✅ **Serverless functions** for API endpoints
- ✅ **Auto-scaling** based on traffic
- ✅ **Real-time WebSocket** support (if needed)

### **Full-Stack Integration**
- ✅ **Seamless API integration** between frontend and backend
- ✅ **Production-ready** blockchain creation and management
- ✅ **Optimized performance** for global users

---

## 🔄 Continuous Deployment

Your project is now set up for:
- **Automatic deployments** on git push
- **Preview deployments** for every PR
- **Rollback capability** to previous versions
- **Zero-downtime deployments**

🎉 **Your blockchain generator is now production-ready and globally accessible!**
