import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '../lib/firebase';

// Create a new user profile in Firestore after registration
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName: displayName || additionalData.displayName || '',
        photoURL: photoURL || '',
        role: additionalData.role || 'student', // Default role
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user profile', error);
    }
  }

  return getUserProfile(user.uid);
};

// Get user profile data
export const getUserProfile = async (userId) => {
  if (!userId) return null;
  
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId, data) => {
  if (!userId) return;
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Upload profile image
export const uploadProfileImage = async (userId, file) => {
  if (!userId || !file) return null;
  
  try {
    // Create a reference to the profile image location
    const storageRef = ref(storage, `profiles/${userId}/${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update user profile with the new image URL
    await updateUserProfile(userId, { photoURL: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return null;
  }
};

// Check if current user is admin
export const isAdmin = async (userId) => {
  if (!userId) return false;
  
  try {
    const userProfile = await getUserProfile(userId);
    return userProfile && userProfile.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
