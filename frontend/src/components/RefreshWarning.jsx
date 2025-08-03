import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RefreshWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Show warning only for authenticated users
    if (currentUser) {
      // Check if user has seen the warning in this session
      const hasSeenWarning = sessionStorage.getItem('refreshWarningShown');
      
      if (!hasSeenWarning) {
        setShowWarning(true);
        sessionStorage.setItem('refreshWarningShown', 'true');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    // Listen for beforeunload event to warn users
    const handleBeforeUnload = (e) => {
      if (currentUser) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your session will be automatically logged out if you refresh or navigate away.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser]);

  const handleDismiss = () => {
    setShowWarning(false);
  };

  if (!showWarning) {
    return null;
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 mx-auto max-w-2xl">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <AlertTriangle className="flex-shrink-0 w-5 h-5 text-amber-600 mt-0.5" />
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-amber-800">
              Session Security Notice
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                For your security, your login session will automatically end if you:
              </p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Refresh this page</li>
                <li>Open the site in a new tab/window</li>
                <li>Navigate away and come back</li>
              </ul>
              <p className="mt-2 font-medium">
                You'll need to log in again to continue using the application.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-4 text-amber-600 hover:text-amber-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefreshWarning;
