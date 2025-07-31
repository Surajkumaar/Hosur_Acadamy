// Firebase Authentication Debug Tool
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../lib/firebase';

export const debugFirebaseAuth = async () => {
  console.log("🔍 Firebase Auth Debug Tool");
  console.log("=".repeat(40));
  
  // Check if auth service is available
  console.log("1. Checking Auth Service:");
  if (auth) {
    console.log("✅ Firebase Auth is initialized");
    console.log("   Current user:", auth.currentUser?.email || "None");
    console.log("   Auth domain:", auth.config.authDomain);
  } else {
    console.log("❌ Firebase Auth is NOT initialized");
    return false;
  }
  
  // Check environment variables
  console.log("\n2. Environment Variables:");
  const envVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
  });
  
  // Check network connectivity
  console.log("\n3. Network Test:");
  try {
    const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
    const response = await fetch(`https://${authDomain}/__/auth/config`, { method: 'HEAD' });
    console.log(`✅ Can reach Firebase Auth servers (${response.status})`);
  } catch (error) {
    console.log(`❌ Cannot reach Firebase Auth servers: ${error.message}`);
  }
  
  console.log("=".repeat(40));
  return true;
};

// Test user creation
export const createTestUser = async (email = "test@hosuracademy.com", password = "test123") => {
  console.log(`\n🧪 Creating test user: ${email}`);
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("✅ Test user created successfully");
    console.log("   User ID:", userCredential.user.uid);
    console.log("   Email:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("ℹ️ Test user already exists, trying to sign in...");
      return await testLogin(email, password);
    } else {
      console.log("❌ Failed to create test user:", error.message);
      console.log("   Error code:", error.code);
      return null;
    }
  }
};

// Test user login
export const testLogin = async (email = "test@hosuracademy.com", password = "test123") => {
  console.log(`\n🔐 Testing login with: ${email}`);
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login successful");
    console.log("   User ID:", userCredential.user.uid);
    console.log("   Email:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.log("❌ Login failed:", error.message);
    console.log("   Error code:", error.code);
    return null;
  }
};

// Run complete Firebase authentication test
export const runAuthTest = async () => {
  console.log("🚀 Starting Firebase Authentication Test");
  
  // Step 1: Debug Firebase setup
  const isSetupValid = await debugFirebaseAuth();
  if (!isSetupValid) {
    console.log("❌ Firebase setup is invalid, cannot proceed with auth test");
    return;
  }
  
  // Step 2: Try to create a test user
  const testUser = await createTestUser();
  if (!testUser) {
    console.log("❌ Could not create or login test user");
    return;
  }
  
  console.log("✅ Firebase Authentication Test Completed Successfully");
  console.log("\n📋 Test Credentials:");
  console.log("   Email: test@hosuracademy.com");
  console.log("   Password: test123");
  
  return testUser;
};
