import { useState, useEffect, useCallback } from 'react';

// Session state stored in memory - will be lost on page refresh
let sessionState = {
  isActive: false,
  loginTime: null,
  lastActivity: null,
  user: null,
  authType: null
};

// Session timeout configuration (in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute

export const useSession = () => {
  const [session, setSession] = useState(sessionState);

  // Initialize session
  const initSession = useCallback((user, authType = 'firebase') => {
    const now = Date.now();
    sessionState = {
      isActive: true,
      loginTime: now,
      lastActivity: now,
      user,
      authType
    };
    setSession({ ...sessionState });
    
    console.log('🔄 Session initialized:', sessionState);
  }, []);

  // Update last activity time
  const updateActivity = useCallback(() => {
    if (sessionState.isActive) {
      sessionState.lastActivity = Date.now();
      setSession({ ...sessionState });
    }
  }, []);

  // Clear session
  const clearSession = useCallback(() => {
    sessionState = {
      isActive: false,
      loginTime: null,
      lastActivity: null,
      user: null,
      authType: null
    };
    setSession({ ...sessionState });
    
    console.log('🔄 Session cleared');
  }, []);

  // Check if session is expired
  const isSessionExpired = useCallback(() => {
    if (!sessionState.isActive || !sessionState.lastActivity) {
      return true;
    }
    
    const now = Date.now();
    const timeSinceLastActivity = now - sessionState.lastActivity;
    
    return timeSinceLastActivity > SESSION_TIMEOUT;
  }, []);

  // Check if this is a fresh page load (session lost)
  const isPageRefresh = useCallback(() => {
    // If we have authentication tokens but no active session, it's likely a page refresh
    const hasFirebaseUser = window.firebase?.auth?.currentUser;
    const hasApiToken = localStorage.getItem('token');
    
    return (hasFirebaseUser || hasApiToken) && !sessionState.isActive;
  }, []);

  // Get session info
  const getSessionInfo = useCallback(() => {
    if (!sessionState.isActive) {
      return null;
    }

    const now = Date.now();
    const sessionDuration = sessionState.lastActivity - sessionState.loginTime;
    const timeUntilExpiry = SESSION_TIMEOUT - (now - sessionState.lastActivity);

    return {
      ...sessionState,
      sessionDuration,
      timeUntilExpiry: Math.max(0, timeUntilExpiry),
      isExpired: isSessionExpired()
    };
  }, [isSessionExpired]);

  // Track user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Check session expiry periodically
  useEffect(() => {
    if (!sessionState.isActive) return;

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        console.log('⏰ Session expired due to inactivity');
        clearSession();
      }
    }, ACTIVITY_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [isSessionExpired, clearSession]);

  return {
    session,
    initSession,
    clearSession,
    updateActivity,
    isSessionExpired,
    isPageRefresh,
    getSessionInfo
  };
};