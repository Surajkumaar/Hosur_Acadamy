import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

// Test Firestore connection
export const testFirestoreConnection = async () => {
  console.log('🧪 Testing Firestore connection...');
  
  try {
    // Try to read from a simple collection
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firestore connection successful');
    console.log(`📊 Test collection has ${snapshot.size} documents`);
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      customData: error.customData
    });
    return false;
  }
};

// Create a test document to initialize Firestore
export const initializeFirestore = async () => {
  console.log('🚀 Initializing Firestore...');
  
  try {
    const testDocRef = doc(db, 'test', 'connection-test');
    await setDoc(testDocRef, {
      message: 'Firestore connection test',
      timestamp: new Date(),
      status: 'connected'
    });
    console.log('✅ Firestore initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Firestore:', error);
    return false;
  }
};

// Create admin user profile
export const createAdminUser = async (userId, email) => {
  console.log(`👤 Creating admin user profile for: ${email}`);
  
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Check if user already exists
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      console.log('📋 User profile already exists:', userSnapshot.data());
      return userSnapshot.data();
    }
    
    // Create new admin user
    const adminProfile = {
      email: email,
      role: 'admin',
      displayName: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    await setDoc(userDocRef, adminProfile);
    console.log('✅ Admin user profile created successfully:', adminProfile);
    return adminProfile;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    throw error;
  }
};

// Check user role
export const checkUserRole = async (userId) => {
  console.log(`🔍 Checking role for user: ${userId}`);
  
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDocRef);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      console.log('👤 User data found:', userData);
      return userData.role || 'user';
    } else {
      console.log('❌ No user profile found');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to check user role:', error);
    return null;
  }
};

// Run comprehensive Firestore diagnostics
export const runFirestoreDiagnostics = async (user) => {
  console.log('🔧 Running Firestore diagnostics...');
  
  const results = {
    connectionTest: false,
    userProfile: null,
    userRole: null,
    errors: []
  };
  
  try {
    // Test 1: Basic connection
    results.connectionTest = await testFirestoreConnection();
    
    if (user) {
      // Test 2: Check user profile
      try {
        results.userRole = await checkUserRole(user.uid);
        if (results.userRole) {
          console.log(`✅ User role: ${results.userRole}`);
        } else {
          console.log('⚠️ No user profile found - this explains the admin access issue');
        }
      } catch (error) {
        results.errors.push(`User profile check failed: ${error.message}`);
      }
    }
    
    console.log('📊 Diagnostics complete:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Diagnostics failed:', error);
    results.errors.push(error.message);
    return results;
  }
};
