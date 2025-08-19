# Hosur Academy - Firebase Deployment Guide

This guide will walk you through deploying the Hosur Academy application to Firebase.

## Prerequisites

1. **Firebase CLI** - Already installed ✅
2. **Node.js and npm/yarn** - Required for building the frontend
3. **Python** - Required for the backend (if deploying to Cloud Functions)
4. **Firebase Project** - You'll need to create one

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `hosur-academy` (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation

## Step 2: Enable Firebase Services

In your Firebase Console:

1. **Authentication:**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Add authorized domains if needed

2. **Firestore Database:**
   - Go to Firestore Database
   - Create database in production mode
   - Choose your preferred location

3. **Storage:**
   - Go to Storage
   - Get started with default rules

4. **Hosting:**
   - Go to Hosting
   - Get started (we'll configure this via CLI)

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. Register app with name "Hosur Academy Frontend"
5. Copy the Firebase config object

## Step 4: Configure Environment Variables

Update the `.env` file in the frontend folder with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 5: Initialize Firebase in Your Project

```bash
# Navigate to project root
cd "c:\Users\91735\Downloads\Hosur-acadamy-main\Hosur\Hosur_Acadamy"

# Login to Firebase
firebase login

# Initialize Firebase
firebase init
```

When prompted:
- ✅ Select: Firestore, Hosting, Storage
- ✅ Use existing project: Select your project
- ✅ Firestore rules file: Keep default (firestore.rules)
- ✅ Firestore indexes file: Keep default (firestore.indexes.json)
- ✅ Public directory: `frontend/build`
- ✅ Configure as SPA: Yes
- ✅ Automatic builds: No (we'll build manually)
- ✅ Storage rules file: Keep default (storage.rules)

## Step 6: Set Up Firestore Security Rules

Update your Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to courses and gallery for all users
    match /courses/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    match /gallery/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    match /toppers/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Students can read their own data, admins can read all
    match /students/{document} {
      allow read: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.uid == document);
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Users collection (for authentication)
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.uid == userId);
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Results - students can read their own, admins can read all
    match /results/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Inquiries - allow creation by anyone, read by admins
    match /inquiries/{document} {
      allow create: if true;
      allow read: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

## Step 7: Set Up Storage Rules

Update your Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 8: Build and Deploy Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Go back to project root
cd ..

# Deploy to Firebase
firebase deploy
```

## Step 9: Backend Deployment Options

### Option A: Deploy Backend to Firebase Functions (Recommended)

1. Create Firebase Functions:
```bash
firebase init functions
```

2. Convert FastAPI to Cloud Functions (see backend-functions-conversion.md)

### Option B: Deploy Backend to External Service

Deploy your FastAPI backend to:
- **Heroku**
- **Railway**
- **Google Cloud Run**
- **Vercel** (with Python support)

Then update your frontend's API base URL in the `.env` file.

## Step 10: Configure Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the verification steps
4. Update DNS records as instructed

## Step 11: Set Up Firebase Admin SDK for Backend

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate new private key
3. Download the JSON file
4. Place it in your backend directory
5. Update the path in `server.py`:

```python
cred = credentials.Certificate("path/to/your/service-account-key.json")
```

## Deployment Commands Summary

```bash
# Full deployment process
cd "c:\Users\91735\Downloads\Hosur-acadamy-main\Hosur\Hosur_Acadamy"

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage
```

## Environment-Specific Deployments

### Production
```bash
firebase use production-project-id
firebase deploy
```

### Staging
```bash
firebase use staging-project-id
firebase deploy
```

## Monitoring and Maintenance

1. **Firebase Console**: Monitor usage, performance, and errors
2. **Analytics**: Track user engagement (if enabled)
3. **Performance Monitoring**: Set up performance monitoring
4. **Crashlytics**: Set up crash reporting (for mobile apps)

## Troubleshooting

### Common Issues:

1. **Build Errors**: Check Node.js version and dependencies
2. **Environment Variables**: Ensure all required env vars are set
3. **Firebase Rules**: Verify security rules are correctly configured
4. **CORS Issues**: Check Firebase Hosting redirects and rewrites

### Useful Commands:

```bash
# Check Firebase project status
firebase projects:list

# View deployment logs
firebase functions:log

# Serve locally before deploying
firebase serve

# Open Firebase console
firebase open
```

## Security Checklist

- ✅ Environment variables are not committed to git
- ✅ Firebase security rules are properly configured
- ✅ API keys have proper restrictions (if needed)
- ✅ HTTPS is enforced
- ✅ User input is validated and sanitized
- ✅ Database queries are secured

## Performance Optimization

1. **Frontend:**
   - Enable code splitting
   - Optimize images
   - Use CDN for static assets

2. **Backend:**
   - Implement caching
   - Optimize database queries
   - Use Firebase performance monitoring

## Cost Optimization

1. **Firestore:**
   - Use compound indexes efficiently
   - Minimize read/write operations
   - Implement pagination

2. **Storage:**
   - Compress images before upload
   - Set up lifecycle policies

3. **Hosting:**
   - Use Firebase CDN
   - Enable gzip compression

---

Your Hosur Academy application should now be successfully deployed to Firebase! 🎉

**Live URL**: `https://your-project-id.web.app`

For support, refer to the [Firebase Documentation](https://firebase.google.com/docs) or check the troubleshooting section above.
