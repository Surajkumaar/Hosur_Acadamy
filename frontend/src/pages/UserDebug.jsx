import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { createUserProfile } from '../lib/user-profile';
import { 
  testFirestoreConnection, 
  initializeFirestore, 
  createAdminUser, 
  runFirestoreDiagnostics 
} from '../utils/firestore-connection-test';

const UserDebug = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const [firestoreStatus, setFirestoreStatus] = useState({});
  const [testingFirestore, setTestingFirestore] = useState(false);

  useEffect(() => {
    // Run Firestore diagnostics when component mounts
    if (currentUser && !loading) {
      testFirestoreConnection();
    }
  }, [currentUser, loading]);

  const runFirestoreTest = async () => {
    setTestingFirestore(true);
    try {
      const results = await runFirestoreDiagnostics(currentUser);
      setFirestoreStatus(results);
      console.log('🔧 Firestore test results:', results);
    } catch (error) {
      console.error('❌ Firestore test failed:', error);
    }
    setTestingFirestore(false);
  };

  const fixFirestoreConnection = async () => {
    setTestingFirestore(true);
    try {
      console.log('🔧 Attempting to fix Firestore connection...');
      
      // Step 1: Initialize Firestore
      await initializeFirestore();
      
      // Step 2: Create admin user if logged in
      if (currentUser) {
        await createAdminUser(currentUser.uid, currentUser.email);
      }
      
      alert('Firestore connection fixed! Please refresh the page.');
      window.location.reload();
    } catch (error) {
      console.error('❌ Failed to fix Firestore:', error);
      alert('Error fixing Firestore: ' + error.message);
    }
    setTestingFirestore(false);
  };

  const makeUserAdmin = async () => {
    if (!currentUser) {
      alert('No user logged in');
      return;
    }

    try {
      await createUserProfile(currentUser, {
        displayName: currentUser.displayName || currentUser.email,
        role: 'admin'
      });
      alert('User has been made admin! Please refresh the page.');
      window.location.reload();
    } catch (error) {
      console.error('Error making user admin:', error);
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">User Debug Information</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Authentication Status</h3>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User Logged In:</strong> {currentUser ? 'Yes' : 'No'}</p>
            {currentUser && (
              <>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>UID:</strong> {currentUser.uid}</p>
                <p><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</p>
              </>
            )}
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">User Profile (Firestore)</h3>
            {userProfile ? (
              <div>
                <p><strong>Profile Exists:</strong> Yes</p>
                <p><strong>Role:</strong> {userProfile.role || 'Not set'}</p>
                <p><strong>Display Name:</strong> {userProfile.displayName || 'Not set'}</p>
                <p><strong>Email:</strong> {userProfile.email || 'Not set'}</p>
                <div className="mt-2">
                  <strong>Full Profile:</strong>
                  <pre className="bg-gray-100 p-2 mt-1 rounded text-sm overflow-auto">
                    {JSON.stringify(userProfile, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div>
                <p><strong>Profile Exists:</strong> No</p>
                <p className="text-red-600">This is likely why you can't access the admin dashboard!</p>
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Firestore Connection Diagnostics</h3>
            <p className="text-sm text-gray-600 mb-4">
              Based on your console errors, Firestore connection is failing. Test and fix it here:
            </p>
            {Object.keys(firestoreStatus).length > 0 ? (
              <div>
                <p><strong>Connection Test:</strong> {firestoreStatus.connectionTest ? '✅ Success' : '❌ Failed'}</p>
                <p><strong>User Role Check:</strong> {firestoreStatus.userRole ? `Found: ${firestoreStatus.userRole}` : '❌ No profile found'}</p>
                {firestoreStatus.errors && firestoreStatus.errors.length > 0 && (
                  <div className="mt-2">
                    <strong>Errors:</strong>
                    <ul className="list-disc list-inside text-red-600">
                      {firestoreStatus.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>No test results yet - Click "Test Firestore Connection" to check</p>
            )}
            
            <div className="mt-4 space-x-2">
              <Button 
                onClick={runFirestoreTest} 
                disabled={testingFirestore}
                variant="outline"
              >
                {testingFirestore ? 'Testing...' : 'Test Firestore Connection'}
              </Button>
              {(!firestoreStatus.connectionTest || !firestoreStatus.userRole) && (
                <Button 
                  onClick={fixFirestoreConnection} 
                  disabled={testingFirestore}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {testingFirestore ? 'Fixing...' : 'Fix Firestore & Create Admin User'}
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Admin Access</h3>
            <p><strong>Can Access Admin:</strong> {
              currentUser && userProfile && userProfile.role === 'admin' ? 
              'Yes ✅' : 'No ❌'
            }</p>
            
            {currentUser && !userProfile && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 mb-2">
                  <strong>Issue Found:</strong> You're logged in but don't have a user profile in Firestore.
                </p>
                <Button onClick={makeUserAdmin} className="bg-blue-600 hover:bg-blue-700">
                  Create Admin Profile for Current User
                </Button>
              </div>
            )}

            {currentUser && userProfile && userProfile.role !== 'admin' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800 mb-2">
                  <strong>Current Role:</strong> {userProfile.role}
                </p>
                <Button onClick={makeUserAdmin} className="bg-blue-600 hover:bg-blue-700">
                  Make This User Admin
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/admin'} 
                className="mr-2"
                disabled={!currentUser || !userProfile || userProfile.role !== 'admin'}
              >
                Go to Admin Dashboard
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDebug;
