// Firebase configuration file
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// Firebase configuration - loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration before initialization
const validateConfig = (config) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing Firebase configuration fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};

try {
  validateConfig(firebaseConfig);
  console.log("✅ Firebase Config validation passed");
  console.log("📋 Using Firebase project:", firebaseConfig.projectId);
  
  // Warn if using the problematic project
  if (firebaseConfig.projectId === 'acadamy-a1ba9') {
    console.warn("⚠️ WARNING: Using potentially problematic Firebase project 'acadamy-a1ba9'");
    console.warn("🔧 If you get auth/configuration-not-found errors, please create a new Firebase project");
    console.warn("� See FIREBASE_SETUP_GUIDE.md for instructions");
  }
} catch (error) {
  console.error("❌ Firebase Config validation failed:", error.message);
  console.error("📖 Please check FIREBASE_SETUP_GUIDE.md for setup instructions");
  // Instead of throwing error, set default values to prevent app from crashing
  firebaseConfig.apiKey = firebaseConfig.apiKey || 'dummy-api-key';
  firebaseConfig.authDomain = firebaseConfig.authDomain || 'dummy-auth-domain';
  firebaseConfig.projectId = firebaseConfig.projectId || 'dummy-project-id';
  firebaseConfig.storageBucket = firebaseConfig.storageBucket || 'dummy-storage-bucket';
  firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || '000000000000';
  firebaseConfig.appId = firebaseConfig.appId || '1:000000000000:web:000000000000';
}

// Log to check config
console.log("Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "Set ✓" : "Missing ✗",
  authDomain: firebaseConfig.authDomain ? "Set ✓" : "Missing ✗",
  projectId: firebaseConfig.projectId ? "Set ✓" : "Missing ✗",
  storageBucket: firebaseConfig.storageBucket ? "Set ✓" : "Missing ✗",
  messagingSenderId: firebaseConfig.messagingSenderId ? "Set ✓" : "Missing ✗",
  appId: firebaseConfig.appId ? "Set ✓" : "Missing ✗"
});

// Initialize Firebase app with a simple, direct approach
console.log("Initializing Firebase with config:", firebaseConfig);

// Initialize Firebase app with error handling
let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Firebase app:", error);
  console.warn("Continuing with limited functionality");
  // Create a minimal mock app to prevent crashes
  app = {
    name: "[Firebase Mock App]",
    options: { ...firebaseConfig },
    automaticDataCollectionEnabled: false
  };
}

// Initialize Firebase services with error handling
let auth, db, storage, analytics;

try {
  auth = getAuth(app);
  console.log("Firebase Auth initialized ✓");
} catch (error) {
  console.error("Failed to initialize Firebase Auth:", error);
  console.warn("Using mock Auth implementation");
  // Create mock auth object with minimal functionality
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {}; // Return unsubscribe function
    }
  };
}

try {
  db = getFirestore(app);
  console.log("Firebase Firestore initialized ✓");
} catch (error) {
  console.error("Failed to initialize Firebase Firestore:", error);
  console.warn("Using mock Firestore implementation");
  // Create mock db object
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) })
      })
    })
  };
}

try {
  storage = getStorage(app);
  console.log("Firebase Storage initialized ✓");
} catch (error) {
  console.error("Failed to initialize Firebase Storage:", error);
  console.warn("Using mock Storage implementation");
  // Create mock storage object
  storage = {
    ref: () => ({
      put: () => Promise.resolve({}),
      getDownloadURL: () => Promise.resolve("")
    })
  };
}

// Only initialize analytics in browser environment
try {
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  if (analytics) {
    console.log("Firebase Analytics initialized ✓");
  }
} catch (error) {
  console.warn("Firebase Analytics initialization failed (non-critical):", error);
  analytics = null;
}

// Log service initialization status
console.log("Firebase services initialized:", {
  auth: auth ? "✓" : "✗",
  db: db ? "✓" : "✗", 
  storage: storage ? "✓" : "✗",
  analytics: analytics ? "✓" : "✗"
});

// Export initialized services
export { app, auth, db, storage, analytics };

// Export Firebase authentication functions
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
};

// Export Firestore functions
export {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
};

// Export Storage functions
export {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// Export Analytics functions
export { getAnalytics };

// Theme-aware toast notification helper (compatible with your CSS variables)
export const showNotification = (toast, { title, description, type = "default" }) => {
  toast({
    title,
    description,
    variant: type === "error" ? "destructive" : "default",
    className: type === "error" 
      ? "bg-destructive text-destructive-foreground" 
      : `bg-accent text-accent-foreground`,
    duration: 3000,
  });
};

// Firebase error handler
export const handleFirebaseError = (error) => {
  console.error("Firebase error:", error);
  
  switch (error.code) {
    case 'auth/configuration-not-found':
      return 'Authentication service unavailable. Please try again later or contact support.';
    case 'auth/api-key-not-valid':
      return 'Authentication configuration error. Please contact support.';
    case 'auth/invalid-api-key':
      return 'Authentication configuration error. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export default app;
