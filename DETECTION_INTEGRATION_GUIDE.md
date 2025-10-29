# 🎯 Detection Integration Guide - MarEye Frontend

## ✅ What Has Been Added

I've integrated the threat detection system directly into your MarEye frontend! Here's what was added:

### New Files Created

1. **`lib/api/detectionService.ts`** - TypeScript API client for detection backend
2. **`components/threat-detection.tsx`** - React component for the detection interface
3. **`app/detection/page.tsx`** - Detection page (already linked in navigation)

### Existing Files (Unchanged)

- Your navigation already has a "Detection" link (line 22 in `components/navigation.tsx`)
- All other existing components and pages remain unchanged

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render

Your backend is ready in the `detection` folder. Follow these steps:

1. **Navigate to detection folder**
   ```bash
   cd C:\Users\Srijit\OneDrive\Desktop\detection
   ```

2. **Initialize Git and push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - MarEye Detection API"
   
   # Create repo at: https://github.com/new
   # Name it: mareye-detection-api
   
   git remote add origin https://github.com/student-srijit/mareye-detection-api.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your `mareye-detection-api` repository
   - Configure:
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 300`
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - **Copy your Render URL**: `https://your-app-name.onrender.com`

4. **Test Backend**
   ```bash
   # Visit in browser:
   https://your-app-name.onrender.com/health
   
   # Should return: {"status": "healthy", ...}
   ```

### Step 2: Configure Frontend Environment Variable

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your `mareye-frontend` project
   - Go to **Settings** → **Environment Variables**

2. **Add Detection API URL**
   - Click "Add New"
   - **Name**: `NEXT_PUBLIC_DETECTION_API_URL`
   - **Value**: `https://your-render-app-name.onrender.com` (your actual Render URL)
   - **Environments**: Check all (Production, Preview, Development)
   - Click "Save"

3. **For Local Development** (Optional)
   - Create `.env.local` in frontend root:
   ```env
   NEXT_PUBLIC_DETECTION_API_URL=http://localhost:10000
   ```
   - This file is already in `.gitignore`

### Step 3: Push Frontend Changes to GitHub

Since your frontend is deployed on Vercel and auto-deploys from GitHub:

1. **Navigate to frontend folder**
   ```bash
   cd C:\Users\Srijit\OneDrive\Desktop\mareye-frontend
   ```

2. **Check status**
   ```bash
   git status
   ```

3. **Add and commit new files**
   ```bash
   git add .
   git commit -m "Add threat detection integration with Render API"
   ```

4. **Push to GitHub**
   ```bash
   git push origin main
   ```

5. **Vercel Auto-Deploys**
   - Vercel will automatically detect the push
   - Wait 2-3 minutes for deployment
   - Your changes will be live!

### Step 4: Test the Integration

1. **Visit your Vercel site**
   ```
   https://mareye-frontend.vercel.app/detection
   ```

2. **Test Detection**
   - Click the upload area
   - Select an image (e.g., from your detection folder)
   - Click "Detect Threats"
   - See the results!

---

## 📁 File Structure

```
mareye-frontend/
├── app/
│   ├── detection/
│   │   └── page.tsx          ✨ NEW - Detection page
│   └── ... (other pages)
├── components/
│   ├── threat-detection.tsx  ✨ NEW - Detection component
│   ├── navigation.tsx         ✓ Already has detection link
│   └── ... (other components)
├── lib/
│   ├── api/
│   │   └── detectionService.ts  ✨ NEW - API client
│   └── ... (other lib files)
└── ... (other files)
```

---

## 🎨 Features Added

### Detection Page
- **URL**: `/detection`
- **Link**: Already in navigation menu (line 22)
- Beautiful hero section
- Upload interface for images and videos
- Results display with annotated images
- Features section explaining the system

### ThreatDetection Component
- ✅ Drag & drop file upload
- ✅ Supports images (JPG, PNG, etc.) and videos (MP4, AVI, etc.)
- ✅ File size validation (50MB max)
- ✅ Real-time detection results
- ✅ Annotated images with bounding boxes
- ✅ Color-coded threat levels (Critical=Red, High=Orange, Medium=Yellow, Low=Green)
- ✅ Video timeline showing when threats appear
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Marine-themed styling matching your site

### Detection API Service
- ✅ Type-safe TypeScript interfaces
- ✅ `detectImage()` - Detect threats in images
- ✅ `detectVideo()` - Detect threats in videos
- ✅ `detect()` - Unified endpoint (auto-detects file type)
- ✅ `checkHealth()` - Check API status
- ✅ `getModelInfo()` - Get model information
- ✅ Proper error handling

---

## 🔍 How It Works

```
User visits /detection
    ↓
Uploads image/video
    ↓
Frontend sends file to Render API
    ↓
Render API processes with YOLOv8
    ↓
Returns threats + annotated image
    ↓
Frontend displays beautiful results
```

---

## 🎯 API Response Example

When a user uploads an image with threats, they get:

```json
{
  "success": true,
  "type": "image",
  "threat_count": 2,
  "overall_threat_level": "HIGH",
  "threats": [
    {
      "class": "Submarine",
      "confidence_percentage": 89.5,
      "threat_level": "HIGH",
      "bounding_box": { "x1": 120, "y1": 200, ... }
    }
  ],
  "annotated_image": "data:image/jpeg;base64,..."
}
```

The component displays:
- Annotated image with bounding boxes
- List of detected threats
- Confidence scores
- Threat level indicators
- Overall assessment

---

## 🐛 Troubleshooting

### CORS Error in Browser
**Problem**: "Access to fetch has been blocked by CORS policy"

**Solution**: Update backend `app.py` to include your Vercel URL:
```python
# In detection/app.py line 29-31
"origins": [
    "http://localhost:3000",
    "https://mareye-frontend.vercel.app",  # Your actual URL
    "https://*.vercel.app"
]
```
Then redeploy on Render.

### Environment Variable Not Working
**Problem**: API calls go to wrong URL

**Solutions**:
1. Check environment variable in Vercel dashboard
2. Ensure no trailing slash in URL
3. Redeploy frontend after adding variable
4. Clear browser cache

### Backend Not Responding
**Problem**: "Failed to fetch" or timeout errors

**Solutions**:
1. Check Render app status (may be sleeping on free tier)
2. Visit health endpoint: `https://your-app.onrender.com/health`
3. Check Render logs for errors
4. Cold start takes 30-60s on free tier

### File Upload Fails
**Problem**: File won't upload or returns error

**Solutions**:
1. Check file size (must be < 50MB)
2. Check file format (images: JPG, PNG, etc. | videos: MP4, AVI, etc.)
3. Check browser console for detailed error
4. Ensure backend is running

---

## 🧪 Testing Locally

### Test Backend Locally
```bash
cd C:\Users\Srijit\OneDrive\Desktop\detection
pip install -r requirements.txt
python app.py

# Backend runs at http://localhost:10000
```

### Test Frontend Locally
```bash
cd C:\Users\Srijit\OneDrive\Desktop\mareye-frontend
npm install
npm run dev

# Frontend runs at http://localhost:3000
# Visit: http://localhost:3000/detection
```

---

## ✅ Deployment Checklist

### Backend (Render)
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] Deployment successful
- [ ] Health check returns 200
- [ ] Render URL copied

### Frontend (Vercel)
- [ ] Detection files added (`detectionService.ts`, `threat-detection.tsx`, `detection/page.tsx`)
- [ ] Environment variable set in Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel deployed successfully
- [ ] Can access `/detection` page
- [ ] Can upload and detect

---

## 🎉 What You Get

After deployment, your users can:

1. Visit `https://mareye-frontend.vercel.app/detection`
2. Upload marine images or videos
3. See AI-powered threat detection results
4. View annotated images with bounding boxes
5. Get threat level assessments
6. See video timelines showing when threats appear

All with a beautiful, marine-themed UI that matches your existing site design!

---

## 📞 Need Help?

### Check Logs
- **Backend**: Render dashboard → Your service → Logs
- **Frontend**: Vercel dashboard → Your project → Logs
- **Browser**: F12 → Console tab

### Test Endpoints
```bash
# Health check
curl https://your-render-app.onrender.com/health

# Test with Python script (from detection folder)
python test_api.py https://your-render-app.onrender.com
```

### Common Issues
- **Cold starts**: Render free tier sleeps after idle (30-60s to wake)
- **Large files**: Max 50MB per file
- **CORS**: Ensure Vercel URL is in backend allowed origins

---

## 🚀 Ready to Deploy!

**Quick Steps**:
1. Deploy backend to Render (10 min)
2. Add environment variable in Vercel (2 min)
3. Push frontend changes to GitHub (2 min)
4. Test on live site! (1 min)

**Total Time**: ~15 minutes to full production! 🎉

