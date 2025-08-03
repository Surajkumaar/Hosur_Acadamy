import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '../lib/firebase';
import { getUserProfile } from '../lib/user-profile';
import { login as apiLogin, getUser as apiGetUser } from '../lib/api';
import sessionManager from '../lib/session-manager';

const UnifiedAuthContext = createContext(null);

export const UnifiedAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [authType, setAuthType] = useState(null); // 'firebase' or 'api'

  useEffect(() => {
    // Check for page refresh scenario first
    if (sessionManager.isPageRefresh()) {
      console.log('🔄 Unified Auth: Page refresh detected - forcing logout');
      sessionManager.forceLogoutOnRefresh();
      setLoading(false);
      return;
    }

    // Check for existing API token first
    const token = localStorage.getItem('token');
    if (token && sessionManager.isSessionActive()) {
      handleApiTokenAuth(token);
      return;
    }

    // If token exists but no active session, it's a page refresh
    if (token && !sessionManager.isSessionActive()) {
      console.log('🔄 API token exists but no active session - forcing logout');
      sessionManager.forceLogoutOnRefresh();
      setLoading(false);
      return;
    }

    // Check if Firebase is properly initialized
    if (!auth) {
      setAuthError("Firebase authentication service is not available");
      setLoading(false);
      return;
    }

    setIsFirebaseReady(true);
    
    // Listen to session manager events
    const unsubscribeSession = sessionManager.addEventListener((event, data) => {
      if (event === 'forced_logout') {
        console.log('🔄 Unified Auth: Session manager forced logout - clearing auth state');
        setCurrentUser(null);
        setUserProfile(null);
        setAuthType(null);
        setAuthError('Session ended due to page refresh');
      }
    });

    const unsubscribe = onAuthStateChanged(auth, 
      async (user) => {
        console.log("🔄 Unified Auth: Firebase auth state changed, user:", user?.email || 'none');
        
        // If user exists but session manager detected a refresh, force logout
        if (user && sessionManager.isPageRefresh()) {
          console.log('🔄 User exists but page was refreshed - forcing logout');
          await sessionManager.forceLogoutOnRefresh();
          return;
        }
        
        setCurrentUser(user);
        setAuthType(user ? 'firebase' : null);
        
        if (user) {
          // Initialize session in session manager
          sessionManager.initSession(user, 'firebase');
          
          // Get user profile with role information
          try {
            console.log("📋 Fetching Firebase user profile for:", user.uid);
            const profile = await getUserProfile(user.uid);
            console.log("👤 Firebase user profile loaded:", profile);
            setUserProfile(profile);
          } catch (error) {
            console.error("❌ Error fetching Firebase user profile:", error);
            
            // Create a default profile based on email
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
                isTemporary: true
              };
              
              console.log("🔧 Using temporary Firebase profile:", defaultProfile);
              setUserProfile(defaultProfile);
            } else {
              setUserProfile(null);
            }
          }
        } else {
          console.log("👤 No Firebase user, clearing profile and session");
          setUserProfile(null);
          sessionManager.clearSession();
        }
        
        setLoading(false);
        setAuthError(null);
      },
      (error) => {
        console.error("Firebase auth state change error:", error);
        setAuthError(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      unsubscribeSession();
    };
  }, []);

  const handleApiTokenAuth = async (token) => {
    try {
      console.log("🔄 Checking API token authentication");
      const userData = await apiGetUser();
      
      if (userData) {
        console.log("✅ API authentication successful:", userData);
        
        // Initialize session for API auth
        const apiUser = {
          email: userData.email,
          uid: userData.email,
        };
        
        sessionManager.initSession(apiUser, 'api');
        
        setAuthType('api');
        setCurrentUser(apiUser);
        setUserProfile({
          email: userData.email,
          role: userData.role,
          displayName: userData.email,
          rollNumber: userData.roll_number,
          isApiAuth: true
        });
      }
    } catch (error) {
      console.error("❌ API token validation failed:", error);
      localStorage.removeItem('token'); // Remove invalid token
    } finally {
      setLoading(false);
    }
  };

  // Unified login function
  const login = async (email, password) => {
    try {
      // First try Backend API authentication (for students created by admin)
      console.log("🔄 Attempting API login for:", email);
      const apiResult = await apiLogin(email, password);
      
      if (apiResult && apiResult.access_token) {
        console.log("✅ API Login successful");
        
        // Store the token
        localStorage.setItem('token', apiResult.access_token);
        
        // Get user data from API
        const userData = await apiGetUser();
        
        // Initialize session for API auth
        const apiUser = {
          email: userData.email,
          uid: userData.email,
        };
        
        sessionManager.initSession(apiUser, 'api');
        
        setAuthType('api');
        setCurrentUser(apiUser);
        setUserProfile({
          email: userData.email,
          role: userData.role,
          displayName: userData.email,
          rollNumber: userData.roll_number,
          isApiAuth: true
        });
        
        return { success: true, user: userData, authType: 'api' };
      }
    } catch (apiError) {
      console.log("❌ API login failed, trying Firebase Auth:", apiError.message);
      
      // Fallback to Firebase Auth if API fails
      if (!isFirebaseReady || !auth) {
        return { 
          success: false, 
          error: 'Authentication service unavailable. Please try again later or contact support.',
          errorCode: 'auth/service-unavailable'
        };
      }

      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setAuthType('firebase');
        return { success: true, user: result.user, authType: 'firebase' };
      } catch (firebaseError) {
        console.error("❌ Firebase login also failed:", firebaseError);
        return { 
          success: false, 
          error: firebaseError.message || 'Failed to sign in',
          errorCode: firebaseError.code
        };
      }
    }
  };

  // Register with email and password (Firebase only)
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
      setAuthType('firebase');
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

  // Unified logout function
  const logout = async () => {
    try {
      // Clear session first
      sessionManager.clearSession();
      
      // Clear API token
      localStorage.removeItem('token');
      
      // Sign out from Firebase if authenticated
      if (authType === 'firebase' && auth) {
        await signOut(auth);
      }
      
      // Clear state
      setCurrentUser(null);
      setUserProfile(null);
      setAuthType(null);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to log out'
      };
    }
  };

  return (
    <UnifiedAuthContext.Provider value={{ 
      currentUser, 
      userProfile,
      login, 
      logout, 
      register,
      loading,
      authError,
      isFirebaseReady,
      authType
    }}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export const useUnifiedAuth = () => useContext(UnifiedAuthContext);
