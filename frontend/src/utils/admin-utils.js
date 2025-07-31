// Admin User Management Utility
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUserProfile } from '../lib/user-profile';

// Create an admin user (use this in Firebase Console or as a one-time script)
export const createAdminUser = async (email, password, displayName) => {
  try {
    console.log(`Creating admin user: ${email}`);
    
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile with admin role
    await createUserProfile(user, {
      displayName: displayName || 'Admin User',
      role: 'admin'
    });
    
    console.log(`✅ Admin user created successfully: ${email}`);
    console.log(`User ID: ${user.uid}`);
    
    return {
      success: true,
      user: user,
      message: `Admin user ${email} created successfully`
    };
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Instructions for creating admin user
export const getAdminCreationInstructions = () => {
  return {
    method1: {
      title: "Method 1: Via Firebase Console",
      steps: [
        "1. Go to Firebase Console → Authentication → Users",
        "2. Click 'Add user'",
        "3. Email: admin@hosuracademy.com",
        "4. Password: admin123",
        "5. After creating, go to Firestore Database",
        "6. Create collection 'users'",
        "7. Add document with user's UID as document ID",
        "8. Add fields: { role: 'admin', email: 'admin@hosuracademy.com', displayName: 'Admin User' }"
      ]
    },
    method2: {
      title: "Method 2: Via Registration Page",
      steps: [
        "1. Go to /register page",
        "2. Create account with admin@hosuracademy.com",
        "3. Go to Firebase Console → Firestore → users collection",
        "4. Find the user document and edit it",
        "5. Change role from 'student' to 'admin'"
      ]
    },
    method3: {
      title: "Method 3: Using Browser Console",
      steps: [
        "1. Open browser console on your app",
        "2. Run: window.createAdminUser('admin@hosuracademy.com', 'admin123', 'Admin User')",
        "3. Check console for success message"
      ]
    }
  };
};

// Helper function to check if current user is admin
export const checkAdminStatus = async (userProfile) => {
  if (!userProfile) {
    return { isAdmin: false, message: "No user profile found" };
  }
  
  if (userProfile.role === 'admin') {
    return { isAdmin: true, message: "User is admin" };
  }
  
  return { isAdmin: false, message: `User role is: ${userProfile.role}` };
};

// Make this available globally for browser console
if (typeof window !== 'undefined') {
  window.createAdminUser = createAdminUser;
  window.getAdminInstructions = getAdminCreationInstructions;
}
