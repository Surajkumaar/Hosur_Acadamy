# Deploy Backend to Railway

## Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

## Step 2: Login to Railway
```bash
railway login
```

## Step 3: Deploy Backend
```bash
cd backend
railway init
railway up
```

## Step 4: Set Environment Variables
In Railway dashboard, set:
- `GOOGLE_APPLICATION_CREDENTIALS`: Upload your Firebase service account key
- Any other environment variables your backend needs

## Step 5: Update Frontend API URL
Update `frontend/.env`:
```
REACT_APP_API_BASE_URL=https://your-railway-app.up.railway.app/api
```

Then rebuild and redeploy:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```
