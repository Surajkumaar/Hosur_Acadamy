// Session Manager - handles session state and automatic logout on refresh
class SessionManager {
  constructor() {
    this.sessionKey = 'session_active';
    this.listeners = [];
    this.checkInterval = null;
    this.pageLoadTime = Date.now();
    
    // This flag will be lost on page refresh, which is what we want
    this.inMemorySession = {
      isActive: false,
      startTime: null,
      user: null,
      authType: null
    };

    // Set up page visibility change detection
    this.setupPageVisibilityDetection();
    
    // Mark this as a fresh page load
    this.markPageLoad();
  }

  // Mark page load time for refresh detection
  markPageLoad() {
    // Use a unique timestamp that gets lost on refresh
    window.sessionPageLoadTime = this.pageLoadTime;
    
    // Check if this is a page refresh by looking for existing auth tokens
    // but no in-memory session
    setTimeout(() => {
      this.checkForRefreshScenario();
    }, 100);
  }

  // Set up page visibility change detection
  setupPageVisibilityDetection() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('🔄 SessionManager: Page hidden');
      } else {
        console.log('🔄 SessionManager: Page visible - checking for refresh');
        this.checkForRefreshScenario();
      }
    });
  }

  // Check if this is a refresh scenario and force logout
  checkForRefreshScenario() {
    if (this.isPageRefresh()) {
      console.log('🔄 SessionManager: Refresh scenario detected - forcing logout');
      this.forceLogoutOnRefresh();
    }
  }

  // Initialize session
  initSession(user, authType = 'firebase') {
    this.inMemorySession = {
      isActive: true,
      startTime: Date.now(),
      user,
      authType
    };
    
    // Start checking for page refresh/new tabs
    this.startRefreshCheck();
    
    console.log('🔄 SessionManager: Session initialized', this.inMemorySession);
    this.notifyListeners('session_start', this.inMemorySession);
  }

  // Check if session is active
  isSessionActive() {
    return this.inMemorySession.isActive;
  }

  // Get current session
  getCurrentSession() {
    return this.inMemorySession;
  }

  // Clear session
  clearSession() {
    const wasActive = this.inMemorySession.isActive;
    
    this.inMemorySession = {
      isActive: false,
      startTime: null,
      user: null,
      authType: null
    };
    
    this.stopRefreshCheck();
    
    if (wasActive) {
      console.log('🔄 SessionManager: Session cleared');
      this.notifyListeners('session_end', null);
    }
  }

  // Check if this is a page refresh scenario
  isPageRefresh() {
    // Check if we have auth tokens but no active in-memory session
    const hasFirebaseAuth = this.checkFirebaseAuth();
    const hasApiToken = localStorage.getItem('token');
    
    return (hasFirebaseAuth || hasApiToken) && !this.inMemorySession.isActive;
  }

  // Check Firebase auth state
  checkFirebaseAuth() {
    try {
      // Check if Firebase is available and has a current user
      return window.firebase?.auth?.currentUser || 
             (window.firebase?.auth && window.firebase.auth().currentUser);
    } catch (error) {
      return false;
    }
  }

  // Force logout due to page refresh
  async forceLogoutOnRefresh() {
    console.log('🔄 SessionManager: Page refresh detected, forcing logout');
    
    try {
      // Clear API token
      localStorage.removeItem('token');
      
      // Sign out from Firebase if available
      if (window.firebase?.auth) {
        await window.firebase.auth().signOut();
      }
      
      this.clearSession();
      this.notifyListeners('forced_logout', 'page_refresh');
      
      return true;
    } catch (error) {
      console.error('❌ SessionManager: Error during forced logout:', error);
      return false;
    }
  }

  // Start monitoring for page refresh
  startRefreshCheck() {
    // Check immediately if this is a refresh scenario
    if (this.isPageRefresh()) {
      setTimeout(() => {
        this.forceLogoutOnRefresh();
      }, 100);
      return;
    }

    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      if (this.isPageRefresh()) {
        this.forceLogoutOnRefresh();
      }
    }, 1000); // Check every second
  }

  // Stop monitoring
  stopRefreshCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Add event listener
  addEventListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('SessionManager listener error:', error);
      }
    });
  }

  // Get session duration
  getSessionDuration() {
    if (!this.inMemorySession.isActive || !this.inMemorySession.startTime) {
      return 0;
    }
    return Date.now() - this.inMemorySession.startTime;
  }

  // Destroy session manager
  destroy() {
    this.stopRefreshCheck();
    this.clearSession();
    this.listeners = [];
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

// Initialize on page load
window.addEventListener('load', () => {
  // Check if this is a page refresh with existing auth
  if (sessionManager.isPageRefresh()) {
    console.log('🔄 Page refresh detected with existing auth - forcing logout');
    sessionManager.forceLogoutOnRefresh();
  }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  sessionManager.destroy();
});

export default sessionManager;