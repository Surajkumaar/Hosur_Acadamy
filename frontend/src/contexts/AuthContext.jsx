import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '../lib/firebase';
import { getUserProfile } from '../lib/user-profile';
import sessionManager from '../lib/session-manager';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Handle page refresh/navigation detection
    const handleBeforeUnload = () => {
      // Clear session flag on page unload
      sessionStorage.removeItem('auth_session_active');
    };

    const handlePageShow = (event) => {
      // Check if this is a page refresh (persisted state from browser cache)
      if (event.persisted || (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD)) {
        console.log('🔄 Page refresh detected via pageshow event');
        if (auth?.currentUser && !sessionStorage.getItem('auth_session_active')) {
          console.log('🔄 Forcing logout due to page refresh');
          signOut(auth);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);

    // Add a session flag to detect page refresh
    const sessionFlag = 'auth_session_active';
    const wasAuthenticated = sessionStorage.getItem(sessionFlag);
    
    // If we have Firebase auth but no session flag, it's a page refresh
    setTimeout(() => {
      if (auth?.currentUser && !wasAuthenticated) {
        console.log('🔄 Page refresh detected with Firebase user - forcing logout');
        signOut(auth).then(() => {
          setCurrentUser(null);
          setUserProfile(null);
          setLoading(false);
        });
        return;
      }
    }, 100);

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
        console.log('🔄 Session manager forced logout - clearing auth state');
        sessionStorage.removeItem(sessionFlag);
        setCurrentUser(null);
        setUserProfile(null);
        setAuthError('Session ended due to page refresh');
      }
    });

    const unsubscribe = onAuthStateChanged(auth, 
      async (user) => {
        console.log("🔄 Auth state changed, user:", user?.email || 'none');
        
        setCurrentUser(user);
        
        if (user) {
          // Set session flag to indicate active authentication
          sessionStorage.setItem(sessionFlag, 'true');
          
          // Initialize session in session manager
          sessionManager.initSession(user, 'firebase');
          
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
          console.log("👤 No user, clearing profile and session");
          sessionStorage.removeItem(sessionFlag);
          setUserProfile(null);
          sessionManager.clearSession();
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

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
      unsubscribe();
      unsubscribeSession();
    };
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
      
      // Set session flag immediately after successful login
      sessionStorage.setItem('auth_session_active', 'true');
      
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
      // Clear session flag first
      sessionStorage.removeItem('auth_session_active');
      
      // Clear session manager
      sessionManager.clearSession();
      
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
