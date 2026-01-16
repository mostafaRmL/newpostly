# 🚀 Deployment Guide for Postly

This guide will help you deploy Postly for **100% FREE** using Railway (backend) and Vercel (frontend).

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Vercel account (sign up at [vercel.com](https://vercel.com))

---

## 🔙 Backend Deployment (Railway)

### Step 1: Push to GitHub
```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your **Postly** repository
4. Railway will automatically detect it's a Node.js project

### Step 3: Add MySQL Database
1. In your Railway project, click **"+ New"** → **"Database"** → **"Add MySQL"**
2. Railway will create a MySQL instance and provide connection details

### Step 4: Configure Variables
In Railway dashboard, go to your **backend service** → **Variables** tab and add:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
DB_HOST=[copy from MySQL service]
DB_USER=[copy from MySQL service]
DB_PASSWORD=[copy from MySQL service]
DB_NAME=[copy from MySQL service]
JWT_SECRET=[generate random string - see below]
```

**Generate JWT_SECRET:**
Run this command locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and use it as JWT_SECRET.

### Step 5: Set Root Directory
1. In Railway, go to your backend service **Settings**
2. Under **Build**, set **Root Directory** to: `server`
3. Set **Start Command** to: `npm start`

### Step 6: Initialize Database
1. In Railway, click on your MySQL service
2. Click **"Data"** tab → **"Query"**
3. Copy all SQL from `server/config/db-schema.sql` and execute it
4. Optionally, run seed data by connecting via command line

### Step 7: Get Backend URL
- Copy your Railway backend URL (e.g., `https://postly-production.up.railway.app`)
- You'll need this for frontend deployment

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your **Postly** repository
4. Vercel will auto-detect it's a Create React App

### Step 2: Configure Build Settings
Vercel should auto-detect these settings:
- **Framework Preset:** Create React App
- **Root Directory:** `./` (leave as root)
- **Build Command:** `npm run build`
- **Output Directory:** `build`

### Step 3: Set Environment Variable
In Vercel project settings → **Environment Variables**, add:
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```
Replace with your actual Railway backend URL.

### Step 4: Deploy
Click **"Deploy"** and wait ~2 minutes.

### Step 5: Update Railway Frontend URL
1. Go back to Railway
2. Update the `FRONTEND_URL` variable to your Vercel URL
3. Railway will automatically redeploy

---

## ✅ Verify Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.railway.app/api/health`
   - Should see: `{"success":true,"message":"Postly API is running"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try registering a new account
   - Create a post
   - Test all features

---

## 💰 Free Tier Limits

### Railway Free Tier:
- **$5 credit/month** (≈500 hours of usage)
- Enough for personal projects and demos
- Sleeps after inactivity (wakes on request)

### Vercel Free Tier:
- **Unlimited** personal projects
- **100GB** bandwidth/month
- Automatic HTTPS
- No credit card required

---

## 🔧 Troubleshooting

### Backend Issues:
- Check Railway logs: **Project → Service → Deployments → View Logs**
- Verify all environment variables are set correctly
- Ensure MySQL database is running
- Check that root directory is set to `server`

### Frontend Issues:
- Check Vercel deployment logs
- Verify `REACT_APP_API_URL` is correct
- Check browser console for errors
- Ensure CORS is configured properly in backend

### Database Connection Issues:
- Verify MySQL service is running in Railway
- Check database credentials in environment variables
- Ensure database schema is initialized

### CORS Errors:
- Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Check that backend CORS settings allow your Vercel domain

---

## 🔄 Updating Your App

### Update Backend:
```bash
git add server/
git commit -m "Update backend"
git push origin main
```
Railway will automatically redeploy.

### Update Frontend:
```bash
git add src/
git commit -m "Update frontend"
git push origin main
```
Vercel will automatically redeploy.

---

## 🎉 You're Done!

Your Postly app is now live and accessible worldwide for **FREE**!

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.railway.app`

Share the Vercel link with anyone to showcase your project! 🚀
