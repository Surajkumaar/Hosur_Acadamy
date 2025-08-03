import React, { useState, useEffect } from 'react';
import { AlertCircle, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import sessionManager from '../lib/session-manager';

const SessionStatus = ({ showDetails = false }) => {
  const { logout } = useAuth();
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    // Listen to session manager events
    const unsubscribe = sessionManager.addEventListener((event, data) => {
      if (event === 'session_start') {
        setSessionInfo(data);
      } else if (event === 'session_end' || event === 'forced_logout') {
        setSessionInfo(null);
        if (event === 'forced_logout') {
          // Trigger logout in auth context
          logout();
        }
      }
    });

    // Initial session check
    const currentSession = sessionManager.getCurrentSession();
    if (currentSession.isActive) {
      setSessionInfo(currentSession);
    }

    return unsubscribe;
  }, [logout]);

  if (!sessionInfo || !sessionInfo.isActive) {
    return null;
  }

  if (!showDetails) {
    return (
      <div className="flex items-center space-x-2 text-sm text-green-600">
        <Shield className="w-4 h-4" />
        <span>Session Active</span>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">Active Session</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-green-600">
          <div className="flex items-center space-x-1">
            <span className="capitalize">{sessionInfo.authType}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-green-700">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Session will automatically end if you refresh the page or open a new tab</span>
        </div>
      </div>
    </div>
  );
};

export default SessionStatus;