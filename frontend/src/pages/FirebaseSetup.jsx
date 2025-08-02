import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, AlertCircle, User, Settings } from 'lucide-react';
import { createAdminAccount, TEST_ADMIN_CREDENTIALS } from '../lib/admin-setup';

const FirebaseSetup = () => {
  const [setupStatus, setSetupStatus] = useState({
    adminCreated: false,
    loading: false,
    error: null,
    success: null,
    firebaseConnected: false,
    testingConnection: false
  });

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    setSetupStatus(prev => ({ ...prev, testingConnection: true }));
    
    try {
      const { auth, db } = await import('../lib/firebase');
      
      if (auth && db) {
        console.log("✅ Firebase services loaded successfully");
        setSetupStatus(prev => ({ 
          ...prev, 
          firebaseConnected: true, 
          testingConnection: false 
        }));
      } else {
        throw new Error("Firebase services not available");
      }
    } catch (error) {
      console.error("❌ Firebase connection test failed:", error);
      setSetupStatus(prev => ({ 
        ...prev, 
        firebaseConnected: false, 
        testingConnection: false,
        error: `Firebase connection failed: ${error.message}`
      }));
    }
  };

  const handleCreateAdmin = async () => {
    setSetupStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await createAdminAccount();
      
      if (result.success) {
        setSetupStatus(prev => ({
          ...prev,
          loading: false,
          adminCreated: true,
          success: "Admin account created successfully!"
        }));
      } else {
        setSetupStatus(prev => ({
          ...prev,
          loading: false,
          error: result.message || "Failed to create admin account"
        }));
      }
    } catch (error) {
      setSetupStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to create admin account"
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Firebase Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Firebase Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {setupStatus.testingConnection ? (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center text-sm">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-2"></div>
                  <span>Testing Firebase connection...</span>
                </div>
              ) : setupStatus.firebaseConnected ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>✅ Firebase is connected and ready!</span>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>❌ Firebase connection failed. Check console for details.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Firebase Setup for Hosur Academy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This page helps you set up the initial Firebase configuration and create an admin account.
              </p>
            </CardContent>
          </Card>

          {/* Admin Account Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Create Admin Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Create the initial admin account to manage students and access the admin panel.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Admin Credentials:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Email:</strong> {TEST_ADMIN_CREDENTIALS.email}</p>
                  <p><strong>Password:</strong> {TEST_ADMIN_CREDENTIALS.password}</p>
                </div>
              </div>

              {setupStatus.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{setupStatus.error}</span>
                </div>
              )}

              {setupStatus.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center text-sm">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{setupStatus.success}</span>
                </div>
              )}

              <Button
                onClick={handleCreateAdmin}
                disabled={setupStatus.loading || setupStatus.adminCreated}
                className="w-full bg-[#13ad89] hover:bg-[#0f8c6d]"
              >
                {setupStatus.loading ? (
                  "Creating Admin Account..."
                ) : setupStatus.adminCreated ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Admin Account Created
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#13ad89] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Login as Admin</h4>
                    <p className="text-sm text-gray-600">Use the admin credentials to login to the admin panel.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#13ad89] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Create Students</h4>
                    <p className="text-sm text-gray-600">Go to Admin → Manage Students to create student accounts.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#13ad89] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Test Student Login</h4>
                    <p className="text-sm text-gray-600">Students can login using their email and date of birth as password.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={() => window.location.href = '/login'}
                  variant="outline"
                  className="mr-3"
                >
                  Go to Login
                </Button>
                <Button 
                  onClick={() => window.location.href = '/test-student-login'}
                  variant="outline"
                >
                  Test Student Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetup;
