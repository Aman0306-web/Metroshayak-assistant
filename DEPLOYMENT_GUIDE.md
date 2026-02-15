# 🚀 DMRC Dashboard - Deployment Guide

This guide will help you deploy the **MetroSahayak** dashboard to the web for free.

---

## 📦 Part 1: Deploy Backend (Python/Flask)
We will use **Render** (free tier) to host the Python backend.

1. **Push Code to GitHub**
   - Ensure your project is in a GitHub repository.
   - Make sure `requirements.txt` and `Procfile` are in the root folder.

2. **Create Service on Render**
   - Go to dashboard.render.com.
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository.

3. **Configure Settings**
   - **Name:** `dmrc-backend` (or similar)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - Click **Create Web Service**.

4. **Get Backend URL**
   - Wait for the deployment to finish (it may take a few minutes).
   - Copy the URL provided at the top (e.g., `https://dmrc-backend.onrender.com`).

---

## 🎨 Part 2: Connect Frontend to Backend

1. Open `app.js` in your local project.
2. Find the `API_BASE_URL` constant at the top.
3. Update the production URL with your new Render URL:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' 
     ? 'http://127.0.0.1:5000' 
     : 'https://your-app-name.onrender.com'; // <--- PASTE RENDER URL HERE
   ```
4. Save, commit, and push changes to GitHub.

---

## 🌐 Part 3: Deploy Frontend (React)
We will use **Netlify** or **Vercel** to host the frontend.

### Option A: Netlify (Easiest)
1. Go to app.netlify.com.
2. Click **Add new site** -> **Import from existing project**.
3. Connect GitHub and select your repo.
4. **Build Settings:**
   - **Build command:** `npm run build` (if using Create React App/Vite)
   - **Publish directory:** `build` or `dist`
5. Click **Deploy Site**.

### Option B: Vercel
1. Go to vercel.com.
2. Click **Add New** -> **Project**.
3. Import your Git repository.
4. Vercel usually auto-detects React settings.
5. Click **Deploy**.

---

## ✅ Done!
Your DMRC Dashboard is now live! 
- Open your Netlify/Vercel URL to view the app.
- It will automatically connect to your Python backend on Render.