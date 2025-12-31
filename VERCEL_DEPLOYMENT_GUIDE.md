# Vercel Deployment Guide for The Human Capital Platform

## 📋 Pre-Deployment Checklist

✅ Backend configured with `vercel.json`
✅ Backend CORS updated for Vercel domains
✅ Frontend TypeScript build successful
✅ Production environment template created
✅ All changes committed and pushed to GitHub

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend API

#### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**:
   - Click "Import Git Repository"
   - Authorize GitHub if needed
   - Select `piyooshrai/THCDashboard`
   - Click "Import"

3. **Configure Backend Project**:
   ```
   Project Name: thc-backend
   Framework Preset: Other
   Root Directory: backend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node.js Version: 18.x
   ```

4. **Add Environment Variables** (Click "Environment Variables" tab):

   **Required Variables:**
   ```bash
   MONGODB_URI=mongodb+srv://development_user:MZniATBePzoQmM69@cluster0.7telxpc.mongodb.net/thehuman_capital?retryWrites=true&w=majority&appName=Cluster0

   JWT_SECRET=super-secret-jwt-key-minimum-32-characters-long-for-security-2025

   JWT_REFRESH_SECRET=different-refresh-secret-also-32-characters-minimum-2025

   JWT_EXPIRES_IN=15m

   JWT_REFRESH_EXPIRES_IN=7d

   NODE_ENV=production

   PORT=5000

   DEFAULT_VA_HOURLY_RATE=60
   ```

   **Optional Variables** (can skip for now):
   ```bash
   AWS_ACCESS_KEY_ID=skip-for-now
   AWS_SECRET_ACCESS_KEY=skip-for-now
   AWS_S3_BUCKET=skip-for-now
   AWS_REGION=us-east-1

   FIREBASE_PROJECT_ID=skip-for-now
   FIREBASE_PRIVATE_KEY=skip-for-now
   FIREBASE_CLIENT_EMAIL=skip-for-now
   ```

5. **Deploy**: Click "Deploy" button

6. **Wait for Deployment** (2-5 minutes)

7. **Get Backend URL**: Copy the deployment URL (e.g., `https://thc-backend-abc123.vercel.app`)

#### Option B: Vercel CLI

```bash
# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy (first time - will ask configuration questions)
vercel

# Answer prompts:
# - Set up and deploy? → Yes
# - Which scope? → Your Vercel account
# - Link to existing project? → No
# - Project name? → thc-backend
# - In which directory is your code? → ./
# - Want to modify settings? → No

# Deploy to production
vercel --prod

# Add environment variables through dashboard or:
vercel env add MONGODB_URI
vercel env add JWT_SECRET
# ... (repeat for all variables)
```

---

### Step 2: Configure MongoDB Atlas

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com

2. **Network Access**:
   - Click "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

   *Note: For better security in production, you can add Vercel's IP ranges instead*

3. **Test Connection**: Your backend should now connect to MongoDB

---

### Step 3: Test Backend Deployment

1. **Health Check**:
   ```bash
   curl https://your-backend-url.vercel.app/health
   ```

   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-12-31T...",
     "uptime": 123.456,
     "environment": "production"
   }
   ```

2. **API Test** (if seeded):
   ```bash
   curl -X POST https://your-backend-url.vercel.app/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@thehumancapital.com",
       "password": "Admin123!"
     }'
   ```

---

### Step 4: Update Frontend Configuration

1. **Update `.env.production`**:
   ```bash
   # Replace with your actual backend URL
   VITE_API_URL=https://your-actual-backend-url.vercel.app/api/v1

   VITE_APP_NAME=The Human Capital
   VITE_APP_ENV=production
   ```

2. **Commit and Push**:
   ```bash
   git add .env.production
   git commit -m "Update production API URL to deployed Vercel backend"
   git push origin claude/human-capital-backend-api-NxWu3
   ```

---

### Step 5: Deploy Frontend

#### Option A: Vercel Dashboard

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository** (same repository):
   - Select `piyooshrai/THCDashboard` again
   - Click "Import"

3. **Configure Frontend Project**:
   ```
   Project Name: thc-dashboard
   Framework Preset: Vite
   Root Directory: ./ (leave empty for root)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node.js Version: 18.x
   ```

4. **Environment Variables**:
   ```bash
   VITE_API_URL=https://your-backend-url.vercel.app/api/v1
   VITE_APP_NAME=The Human Capital
   VITE_APP_ENV=production
   ```

5. **Deploy**: Click "Deploy"

6. **Get Frontend URL**: Copy the deployment URL (e.g., `https://thc-dashboard.vercel.app`)

#### Option B: Vercel CLI

```bash
# Navigate to root directory
cd /home/user/THCDashboard

# Deploy
vercel

# Answer prompts for frontend
# Then deploy to production
vercel --prod
```

---

### Step 6: Update Backend FRONTEND_URL

1. **Go to Backend Project Settings** in Vercel Dashboard

2. **Environment Variables**:
   - Add or update `FRONTEND_URL` variable
   - Set value to your frontend URL: `https://thc-dashboard.vercel.app`

3. **Redeploy Backend** (to pick up the new env variable)

---

### Step 7: Test Full Application

1. **Open Frontend**: Navigate to `https://thc-dashboard.vercel.app`

2. **Test Login**:
   - Email: `admin@thehumancapital.com`
   - Password: `Admin123!`

3. **Verify Features**:
   - ✅ Dashboard loads with stats
   - ✅ Clients page shows data
   - ✅ VAs page shows data
   - ✅ Can navigate between pages
   - ✅ No CORS errors in console

---

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error**:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `MONGODB_URI` environment variable is correct
- View Vercel deployment logs

**CORS Errors**:
- Verify frontend URL ends with `.vercel.app`
- Check backend logs for rejected origins
- Ensure `FRONTEND_URL` env variable is set

**Timeout Errors**:
- Vercel has 10-second limit for serverless functions
- Check which endpoints are slow
- Consider using Vercel Pro for 60-second limit
- Or migrate to Railway/Render for unlimited timeouts

### Frontend Issues

**API Errors**:
- Verify `VITE_API_URL` in Vercel environment variables
- Check browser console for actual error messages
- Test API endpoints directly with curl

**Build Errors**:
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

---

## 📊 Deployment URLs

After deployment, update these:

**Backend URL**: `https://_____________________.vercel.app`
**Frontend URL**: `https://_____________________.vercel.app`

---

## 🔐 Security Notes

1. **Environment Variables**: Never commit `.env` files to GitHub
2. **MongoDB**: Consider IP whitelisting instead of `0.0.0.0/0` in production
3. **JWT Secrets**: Use strong, unique secrets (already configured)
4. **HTTPS**: All Vercel deployments automatically use HTTPS
5. **CORS**: Currently allows all `.vercel.app` domains - tighten in production

---

## 📈 Next Steps After Deployment

1. **Custom Domain**: Add your own domain in Vercel settings
2. **SSL Certificate**: Automatic with custom domain
3. **Analytics**: Enable Vercel Analytics
4. **Monitoring**: Set up error tracking (Sentry, LogRocket)
5. **Backups**: Regular MongoDB backups
6. **CI/CD**: Automatic deployments on git push (already enabled)

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **GitHub Issues**: Report issues in repository

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend health check passes
- [ ] MongoDB connection working
- [ ] Environment variables configured
- [ ] Frontend `.env.production` updated
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads without errors
- [ ] Login works with test user
- [ ] All pages navigate correctly
- [ ] No CORS errors
- [ ] Backend `FRONTEND_URL` updated
- [ ] Custom domain configured (optional)

---

**Deployment Date**: _________________
**Backend URL**: _________________
**Frontend URL**: _________________
**Deployed By**: _________________
