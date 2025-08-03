import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import sessionManager from '../lib/session-manager';
import { Button } from '../components/ui/button';
import { RefreshCw, LogOut, Shield, AlertTriangle } from 'lucide-react';

const SessionTest = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isRefreshTest, setIsRefreshTest] = useState(false);

  const handleRefreshTest = () => {
    setIsRefreshTest(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Test Page</h1>
          <p className="text-gray-600 mb-4">Please log in to test session management</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Session Management Test
          </h1>
          
          {/* User Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Current User</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Email:</strong> {currentUser.email}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Role:</strong> {userProfile?.role || 'Loading...'}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  <strong>UID:</strong> {currentUser.uid}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Auth Type:</strong> Firebase
                </p>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Session Status</h3>
            <div className="text-sm text-green-700">
              <p><strong>Session Active:</strong> Yes</p>
              <p><strong>Auth Type:</strong> Firebase</p>
              <p><strong>Auto-logout on refresh:</strong> Enabled</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-amber-800 mb-2">
                  Session Security Policy
                </h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Sessions are stored in memory only (not in localStorage)</li>
                  <li>• Refreshing the page will automatically log you out</li>
                  <li>• Opening the site in a new tab will log you out</li>
                  <li>• Sessions expire after 30 minutes of inactivity</li>
                  <li>• User activity (clicks, typing, scrolling) extends the session</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Actions</h3>
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleRefreshTest}
                disabled={isRefreshTest}
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshTest ? 'animate-spin' : ''}`} />
                Test Page Refresh
              </Button>

              <Button
                onClick={() => window.open(window.location.href, '_blank')}
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                Test New Tab
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Manual Logout
              </Button>
            </div>

            {isRefreshTest && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">
                  <strong>Refreshing page in 2 seconds...</strong> You will be automatically logged out.
                </p>
              </div>
            )}
          </div>

          {/* Session Manager Info */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Manager Status</h3>
            <div className="text-sm text-gray-700">
              <p><strong>Session Active:</strong> {sessionManager.isSessionActive() ? 'Yes' : 'No'}</p>
              <p><strong>Page Refresh Detection:</strong> {sessionManager.isPageRefresh() ? 'Detected' : 'Not Detected'}</p>
              <p><strong>Auto-logout:</strong> Enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTest;
