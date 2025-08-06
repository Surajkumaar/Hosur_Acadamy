// Firebase Setup for Admin Account
// Run this once to create an admin user

export const createAdminAccount = async () => {
  try {
    console.log("Creating admin account...");
    
    // Import Firebase services dynamically to handle potential import issues
    const { createUserWithEmailAndPassword, auth } = await import('./firebase');
    const { createUserProfile } = await import('./user-profile');
    
    if (!auth) {
      throw new Error("Firebase Auth is not initialized properly");
    }
    
    const adminEmail = "admin@hosuracademy.com";
    const adminPassword = "admin123"; // Change this to a secure password
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log("✅ Admin Firebase Auth user created:", userCredential.user.uid);
    
    // Create admin profile in Firestore
    const adminProfileData = {
      email: adminEmail,
      displayName: "Admin User",
      role: 'admin',
      createdAt: new Date().toISOString(),
      isSetupAccount: true
    };
    
    await createUserProfile(userCredential.user, adminProfileData);
    console.log("✅ Admin profile created in Firestore");
    
    console.log(`
    🎉 Admin account created successfully!
    
    Login Credentials:
    Email: ${adminEmail}
    Password: ${adminPassword}
    
    Please change the password after first login.
    `);
    
    return {
      success: true,
      email: adminEmail,
      uid: userCredential.user.uid
    };
    
  } catch (error) {
    console.error("❌ Admin account creation failed:", error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log("ℹ️ Admin account already exists");
      return { success: false, message: "Admin account already exists" };
    }
    
    throw error;
  }
};

// Alternative simple admin credentials for testing
export const TEST_ADMIN_CREDENTIALS = {
  email: "admin@hosuracademy.com",
  password: "admin123"
};
