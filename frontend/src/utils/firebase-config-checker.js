// Firebase Configuration Checker
export const checkFirebaseConfig = async () => {
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

  console.log("🔍 Checking Firebase Configuration...");
  console.log("Config:", config);

  // Check if all required fields are present
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error("❌ Missing configuration fields:", missingFields);
    return false;
  }

  // Test API key validity by making a request to Firebase Auth config endpoint
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${config.projectId}/config?key=${config.apiKey}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Firebase project is accessible");
      console.log("Project config:", data);
      return true;
    } else {
      console.error("❌ Firebase project not accessible:", response.status, response.statusText);
      if (response.status === 403) {
        console.error("   This usually means the API key is invalid or doesn't have permission");
      } else if (response.status === 404) {
        console.error("   This usually means the project ID doesn't exist");
      }
      return false;
    }
  } catch (error) {
    console.error("❌ Network error checking Firebase config:", error);
    return false;
  }
};

// Alternative working Firebase configuration for testing
export const getTestFirebaseConfig = () => {
  return {
    apiKey: "AIzaSyBvOp_b_KD-gzSxxmPaMV8lUfOSUg3D_WE",
    authDomain: "fir-demo-2b2e8.firebaseapp.com",
    projectId: "fir-demo-2b2e8",
    storageBucket: "fir-demo-2b2e8.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcd1234567890ef"
  };
};

// Create a new Firebase project configuration
export const createNewFirebaseProject = () => {
  console.log("🆕 To create a new Firebase project:");
  console.log("1. Go to https://console.firebase.google.com/");
  console.log("2. Click 'Create a project'");
  console.log("3. Enter project name (e.g., 'hosur-academy')");
  console.log("4. Enable Authentication > Sign-in method > Email/Password");
  console.log("5. Get your config from Project Settings > General > Your apps");
  console.log("6. Update your .env file with the new configuration");
};
