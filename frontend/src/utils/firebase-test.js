// Firebase connection test utility
import { auth, db, storage } from '../lib/firebase';

export const testFirebaseConnection = async () => {
  const results = {
    auth: false,
    firestore: false,
    storage: false,
    errors: []
  };

  // Test Firebase Auth
  try {
    if (auth) {
      results.auth = true;
      console.log("✓ Firebase Auth is available");
    } else {
      results.errors.push("Firebase Auth is not initialized");
    }
  } catch (error) {
    results.errors.push(`Firebase Auth error: ${error.message}`);
  }

  // Test Firestore
  try {
    if (db) {
      results.firestore = true;
      console.log("✓ Firebase Firestore is available");
    } else {
      results.errors.push("Firebase Firestore is not initialized");
    }
  } catch (error) {
    results.errors.push(`Firebase Firestore error: ${error.message}`);
  }

  // Test Storage
  try {
    if (storage) {
      results.storage = true;
      console.log("✓ Firebase Storage is available");
    } else {
      results.errors.push("Firebase Storage is not initialized");
    }
  } catch (error) {
    results.errors.push(`Firebase Storage error: ${error.message}`);
  }

  return results;
};

export const validateEnvironmentVariables = () => {
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error("Missing Firebase environment variables:", missing);
    return false;
  }
  
  console.log("✓ All Firebase environment variables are set");
  return true;
};
