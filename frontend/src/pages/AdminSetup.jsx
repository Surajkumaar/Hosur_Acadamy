import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, doc, setDoc, getDoc } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, AlertCircle, User, Shield } from 'lucide-react';

const AdminSetup = () => {
  const { currentUser, userProfile } = useAuth();
  const [setupStatus, setSetupStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    if (currentUser) {
      checkAdminProfile();
    }
  }, [currentUser]);

  const checkAdminProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const profile = userDoc.data();
        setAdminProfile(profile);
        if (profile.role === 'admin') {
          setSetupStatus('✅ Admin profile already exists');
        } else {
          setSetupStatus('⚠️ User profile exists but role is not admin');
        }
      } else {
        setSetupStatus('❌ No user profile found');
      }
    } catch (error) {
      console.error('Error checking admin profile:', error);
      setSetupStatus('❌ Error checking profile: ' + error.message);
    }
  };

  const setupAdminProfile = async () => {
    if (!currentUser) {
      setSetupStatus('❌ No user logged in');
      return;
    }

    setIsLoading(true);
    setSetupStatus('🔧 Setting up admin profile...');

    try {
      const adminProfileData = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'Admin User',
        role: 'admin',
        isAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileSetup: true
      };

      // Save to users collection
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, adminProfileData, { merge: true });

      setAdminProfile(adminProfileData);
      setSetupStatus('✅ Admin profile created successfully!');
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error setting up admin profile:', error);
      setSetupStatus('❌ Error creating admin profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please log in first to set up your admin profile.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Profile Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current User Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Current User
              </h3>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>UID:</strong> {currentUser.uid}</p>
                <p><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</p>
              </div>
            </div>

            {/* Current Profile Status */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Profile Status</h3>
              {adminProfile ? (
                <div className="text-sm space-y-1">
                  <p><strong>Role:</strong> {adminProfile.role}</p>
                  <p><strong>Is Admin:</strong> {adminProfile.isAdmin ? 'Yes' : 'No'}</p>
                  <p><strong>Created:</strong> {adminProfile.createdAt}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No profile data found</p>
              )}
            </div>

            {/* Setup Status */}
            {setupStatus && (
              <Alert className={setupStatus.includes('✅') ? 'border-green-200 bg-green-50' : 
                              setupStatus.includes('❌') ? 'border-red-200 bg-red-50' : 
                              'border-yellow-200 bg-yellow-50'}>
                <AlertDescription>{setupStatus}</AlertDescription>
              </Alert>
            )}

            {/* Setup Button */}
            <div className="flex gap-2">
              <Button 
                onClick={setupAdminProfile}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Setup Admin Profile
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={checkAdminProfile}
                disabled={isLoading}
              >
                Refresh Status
              </Button>
            </div>

            {/* Instructions */}
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Instructions</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Make sure you're logged in with your admin email</li>
                <li>Click "Setup Admin Profile" to create your admin profile</li>
                <li>The page will refresh automatically after setup</li>
                <li>You should then be able to access the admin dashboard</li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Troubleshooting</h3>
              <div className="text-sm space-y-2">
                <p><strong>If you still get permission errors:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Clear your browser cache and cookies</li>
                  <li>Log out and log back in</li>
                  <li>Check the browser console for Firebase errors</li>
                  <li>Ensure your Firestore rules are deployed correctly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
