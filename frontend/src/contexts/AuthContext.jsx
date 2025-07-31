import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '../lib/firebase';
import { getUserProfile } from '../lib/user-profile';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!auth) {
      setAuthError("Firebase authentication service is not available");
      setLoading(false);
      return;
    }

    setIsFirebaseReady(true);
    const unsubscribe = onAuthStateChanged(auth, 
      async (user) => {
        console.log("🔄 Auth state changed, user:", user?.email || 'none');
        setCurrentUser(user);
        
        if (user) {
          // Get user profile with role information
          try {
            console.log("📋 Fetching user profile for:", user.uid);
            const profile = await getUserProfile(user.uid);
            console.log("👤 User profile loaded:", profile);
            setUserProfile(profile);
          } catch (error) {
            console.error("❌ Error fetching user profile:", error);
            
            // If Firestore is not set up, create a default profile based on email
            if (error.message.includes('Firestore') || error.message.includes('database') || error.message.includes('transport errored')) {
              console.log("⚠️ Firestore connection issues, creating default profile");
              
              const isAdmin = user.email && (
                user.email.toLowerCase().includes('admin') || 
                user.email.toLowerCase() === 'admin@hosuracademy.com'
              );
              
              const defaultProfile = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email,
                role: isAdmin ? 'admin' : 'student',
                isTemporary: true // Flag to indicate this is a temporary profile
              };
              
              console.log("🔧 Using temporary profile:", defaultProfile);
              setUserProfile(defaultProfile);
            } else {
              setUserProfile(null);
            }
          }
        } else {
          console.log("👤 No user, clearing profile");
          setUserProfile(null);
        }
        
        setLoading(false);
        setAuthError(null);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setAuthError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Sign in with email and password
  const login = async (email, password) => {
    if (!isFirebaseReady || !auth) {
      return { 
        success: false, 
        error: 'Authentication service unavailable. Please try again later or contact support.',
        errorCode: 'auth/service-unavailable'
      };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in',
        errorCode: error.code
      };
    }
  };

  // Register with email and password
  const register = async (email, password) => {
    if (!isFirebaseReady || !auth) {
      return { 
        success: false, 
        error: 'Authentication service unavailable. Please try again later or contact support.',
        errorCode: 'auth/service-unavailable'
      };
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        error: error.message || 'Failed to create account',
        errorCode: error.code
      };
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to log out'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userProfile,
      login, 
      logout, 
      register,
      loading,
      authError,
      isFirebaseReady
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
