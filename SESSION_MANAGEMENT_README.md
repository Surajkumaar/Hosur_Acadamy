# Session Management with Auto-Logout on Page Refresh

## Overview

This feature implements a security-focused session management system that automatically logs out users when they refresh the page, open a new tab, or navigate away and come back. This prevents session hijacking and ensures that authentication states are not persisted across page reloads.

## Key Features

### 1. In-Memory Session Storage
- Sessions are stored only in JavaScript memory, not in localStorage or sessionStorage
- Session state is lost when the page is refreshed or closed
- No persistent authentication tokens remain in browser storage

### 2. Automatic Logout Triggers
- **Page Refresh**: F5, Ctrl+R, or browser refresh button
- **New Tab/Window**: Opening the same URL in a new tab
- **Navigation**: Leaving the site and returning
- **Session Timeout**: 30 minutes of inactivity

### 3. Session Activity Tracking
- Monitors user interactions (clicks, typing, scrolling, touch events)
- Updates last activity timestamp to extend session
- Provides real-time session duration and time until expiry

### 4. User Notifications
- Visual session status indicator in the header
- Warning notification about session policy for new users
- Browser confirmation dialog when attempting to leave the page

## Implementation Details

### Core Components

#### 1. Session Manager (`lib/session-manager.js`)
```javascript
// Singleton class that manages session state
class SessionManager {
  // In-memory session storage (lost on refresh)
  inMemorySession = {
    isActive: false,
    startTime: null,
    user: null,
    authType: null
  }
}
```

#### 2. Session Hook (`hooks/use-session.js`)
```javascript
// React hook for session management
export const useSession = () => {
  // Session timeout: 30 minutes
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  
  // Track user activity
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
}
```

#### 3. Session Status Component (`components/SessionStatus.jsx`)
```javascript
// Visual indicator showing current session status
const SessionStatus = ({ showDetails = false }) => {
  // Displays session duration and auth type
  // Shows warnings about refresh behavior
}
```

#### 4. Refresh Warning Component (`components/RefreshWarning.jsx`)
```javascript
// One-time notification about session policy
const RefreshWarning = () => {
  // Shows warning to first-time users
  // Prevents page unload with confirmation dialog
}
```

### Integration with Authentication

#### AuthContext Integration
```javascript
// Modified to work with session manager
useEffect(() => {
  // Check for page refresh scenario first
  if (sessionManager.isPageRefresh()) {
    sessionManager.forceLogoutOnRefresh();
    return;
  }
  
  // Initialize session on successful auth
  sessionManager.initSession(user, 'firebase');
}, []);
```

#### Logout Integration
```javascript
const logout = async () => {
  // Clear session first
  sessionManager.clearSession();
  
  // Then perform Firebase logout
  await signOut(auth);
};
```

## User Experience

### For Students
1. **Login**: Normal login process with session initialization
2. **Active Session**: Session status indicator shows active time
3. **Page Refresh**: Automatic logout with redirect to login page
4. **New Tab**: Opening in new tab triggers logout in original tab
5. **Inactivity**: 30-minute timeout with automatic logout

### For Admins
1. **Same behavior as students** with additional admin route protection
2. **Session Test Page**: `/session-test` for testing session behavior
3. **Detailed Session Info**: Extended session information display

### Visual Indicators

#### Header Session Status
```javascript
// Shows in header when authenticated
<SessionStatus />
// Displays: "Session Active 🛡️ 5:23 ⏰"
```

#### Detailed Session Info
```javascript
// On session test page
<SessionStatus showDetails={true} />
// Shows full session information panel
```

## Security Benefits

### 1. Prevents Session Hijacking
- No persistent tokens in browser storage
- Sessions die with browser tabs/windows

### 2. Reduces Attack Surface
- Cannot access authenticated state from new tabs
- Eliminates persistence-based vulnerabilities

### 3. Forces Fresh Authentication
- Users must actively log in for each session
- Prevents unauthorized access from unattended devices

### 4. Activity Monitoring
- Tracks user engagement
- Prevents zombie sessions

## Configuration

### Session Timeout
```javascript
// In use-session.js
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute
```

### Activity Events
```javascript
// Events that extend session
const activityEvents = [
  'mousedown', 'mousemove', 'keypress', 
  'scroll', 'touchstart', 'click'
];
```

## Testing

### Manual Testing
1. **Login** to the application
2. **Navigate** to `/session-test` to see session details
3. **Refresh** the page and verify automatic logout
4. **Open** new tab with same URL and verify logout
5. **Wait** 30 minutes for timeout testing

### Test Page Features
- Real-time session information
- Manual refresh test button
- New tab test button  
- Session duration display
- Activity monitoring status

## Browser Compatibility

### Supported Events
- `beforeunload`: Warns before leaving page
- `load`: Detects page refresh
- Activity events: Mouse, keyboard, touch, scroll

### Storage APIs Used
- **sessionStorage**: For one-time warning flags
- **Memory only**: For session state (intentionally volatile)

## Error Handling

### Page Refresh Detection
```javascript
isPageRefresh() {
  // Check if auth tokens exist but no active session
  const hasFirebaseAuth = this.checkFirebaseAuth();
  const hasApiToken = localStorage.getItem('token');
  
  return (hasFirebaseAuth || hasApiToken) && !this.inMemorySession.isActive;
}
```

### Graceful Degradation
- Falls back to normal logout if session manager fails
- Maintains authentication state consistency
- Provides user feedback on session events

## Future Enhancements

### Potential Improvements
1. **Configurable Timeout**: Admin-controlled session duration
2. **Session History**: Log session events for audit
3. **Multi-Tab Sync**: Coordinate sessions across tabs
4. **Grace Period**: Brief warning before timeout
5. **Remember Device**: Optional persistent sessions for trusted devices

### API Integration
```javascript
// Future: Server-side session validation
const validateSession = async (sessionId) => {
  // Validate with backend
  // Return session status
};
```

## Troubleshooting

### Common Issues

#### Session Not Initializing
- Check Firebase authentication state
- Verify session manager import
- Check browser console for errors

#### Premature Logout
- Verify activity event listeners
- Check session timeout configuration
- Test user interaction detection

#### Warning Not Showing
- Check sessionStorage for warning flag
- Verify component mounting order
- Test authentication state

### Debug Information
```javascript
// Session manager status
console.log('Session Active:', sessionManager.isSessionActive());
console.log('Page Refresh:', sessionManager.isPageRefresh());
console.log('Session Duration:', sessionManager.getSessionDuration());
```

## Conclusion

This session management system provides robust security through automatic logout on page refresh while maintaining a user-friendly experience. The in-memory storage approach ensures that authentication states cannot persist beyond the current browser session, significantly reducing security risks associated with unattended devices or session hijacking.
