# 🔧 Environment Variable Setup

## Local Development (.env.local)

Create a file named `.env.local` in the root of your frontend:

```env
# Detection API URL
# For local testing (when backend runs on your machine)
NEXT_PUBLIC_DETECTION_API_URL=http://localhost:10000

# OR for testing against deployed backend
# NEXT_PUBLIC_DETECTION_API_URL=https://your-app-name.onrender.com

# Your existing environment variables
GROK_API_KEY=your_grok_api_key_here
```

**Note**: `.env.local` is already in `.gitignore` and won't be committed to GitHub.

---

## Vercel Production Environment

1. Go to https://vercel.com/dashboard
2. Select your `mareye-frontend` project
3. Click **Settings** → **Environment Variables**
4. Add:
   - **Name**: `NEXT_PUBLIC_DETECTION_API_URL`
   - **Value**: `https://your-actual-render-app-name.onrender.com`
   - **Environments**: Check all boxes (Production, Preview, Development)
5. Click **Save**
6. Redeploy your app (or push to GitHub to trigger auto-deploy)

---

## Important Notes

### NEXT_PUBLIC_ Prefix
- Environment variables that start with `NEXT_PUBLIC_` are exposed to the browser
- This is necessary because the detection API is called from the client-side React component
- Never put sensitive keys/secrets in `NEXT_PUBLIC_` variables

### After Setting Environment Variable
- Vercel: Must redeploy for changes to take effect
- Local: Restart your dev server (`npm run dev`)

### Checking if it Works
Open browser console on `/detection` page and run:
```javascript
console.log(process.env.NEXT_PUBLIC_DETECTION_API_URL)
```

You should see your Render URL.

---

## Example Values

### Local Development
```env
NEXT_PUBLIC_DETECTION_API_URL=http://localhost:10000
```

### Production (after deploying backend to Render)
```env
NEXT_PUBLIC_DETECTION_API_URL=https://mareye-detection-api-xyz.onrender.com
```

Replace `mareye-detection-api-xyz` with your actual Render app name!

