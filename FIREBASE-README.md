# Hosur Academy - Firebase Implementation Guide

This guide explains how the Hosur Academy project has been set up to use Firebase for authentication, database, and deployment.

## Project Structure

- `frontend/src/lib/firebase.js`: Core Firebase configuration and service exports
- `frontend/src/lib/database.js`: Firestore database service functions
- `frontend/src/lib/user-profile.js`: User profile management functions
- `frontend/src/contexts/AuthContext.jsx`: Authentication context provider using Firebase Auth
- `firebase-rules.js`: Security rules for Firestore and Storage
- `FIREBASE-DEPLOYMENT-GUIDE.md`: Detailed guide for deploying the application to Firebase

## 1. Firebase Authentication

The application uses Firebase Authentication with email/password sign-in method. The implementation includes:

- User registration
- User login
- Password reset functionality
- Authentication state persistence
- Protected routes based on user roles

### Key Files:
- `src/contexts/AuthContext.jsx`: Authentication context provider
- `src/pages/Login.jsx`: Login page
- `src/pages/Register.jsx`: Registration page

## 2. Firebase Database (Firestore)

The application uses Firestore for storing and retrieving data:

- Students collection: Student records and performance data
- Courses collection: Course details and materials
- Results collection: Exam and assessment results
- Inquiries collection: Student inquiries and contact form submissions
- Toppers collection: Top-performing students to showcase
- Gallery collection: Images and media for the gallery section

### Key Files:
- `src/lib/database.js`: Database service functions
- `firebase-rules.js`: Firestore security rules

## 3. Firebase Storage

Firebase Storage is used for:

- Profile images
- Course materials
- Gallery images
- Result documents

### Key Files:
- `src/lib/firebase.js`: Storage initialization
- `src/lib/user-profile.js`: Profile image upload functions
- `firebase-rules.js`: Storage security rules

## 4. Setup Instructions

1. **Install Firebase:**
   ```
   cd Hosur/Hosur_Acadamy/frontend
   npm install firebase
   ```

2. **Configure Firebase:**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication, Firestore, and Storage services
   - Get your Firebase configuration from Project settings
   - Update the `.env` file with your Firebase configuration values

3. **Update Security Rules:**
   - Copy the security rules from `firebase-rules.js` to your Firebase Console
   - Apply the rules to Firestore and Storage

4. **Deploy:**
   - Follow the instructions in `FIREBASE-DEPLOYMENT-GUIDE.md`

## 5. Environment Variables

The following environment variables need to be set in your `.env` file:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id # Optional
```

## 6. Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## 7. Firebase Hosting vs Other Options

While this guide focuses on Firebase services for authentication and database, the actual hosting can be done through:

1. **Firebase Hosting**: Simple option for static sites and client-side rendering
2. **Vercel**: Better for Next.js applications with server-side rendering
3. **Custom Server**: For more complex server-side logic

The deployment guide provides details for Firebase Hosting, but you can adapt it for other hosting options as needed.
