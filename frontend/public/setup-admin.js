// Admin Setup Script for Hosur Academy
// Run this in the browser console after logging in with your admin email

console.log("🔧 Setting up admin user...");

// Import Firebase modules (these should already be available in your app)
import { db, doc, setDoc, auth } from './src/lib/firebase.js';

async function setupAdminUser() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("❌ No user is currently logged in");
      return;
    }

    console.log("👤 Current user:", currentUser.email);

    // Create admin profile in Firestore
    const adminProfile = {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || "Admin User",
      role: 'admin',
      isAdmin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to users collection
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, adminProfile, { merge: true });

    console.log("✅ Admin profile created successfully!");
    console.log("📋 Profile:", adminProfile);
    
    // Refresh the page to load the new profile
    window.location.reload();
    
  } catch (error) {
    console.error("❌ Error setting up admin user:", error);
  }
}

// Run the setup
setupAdminUser();
