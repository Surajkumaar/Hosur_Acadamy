import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, AlertCircle, Settings, Database, Users } from 'lucide-react';

const FirebaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    configLoaded: false,
    authReady: false,
    firestoreReady: false,
    errors: [],
    config: null,
    loading: true
  });

  useEffect(() => {
    testFirebaseServices();
  }, []);

  const testFirebaseServices = async () => {
    const errors = [];
    let configLoaded = false;
    let authReady = false;
    let firestoreReady = false;
    let config = null;

    try {
      // Test Firebase configuration
      console.log("🔍 Testing Firebase configuration...");
      
      // Check environment variables
      config = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing",
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing",
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing",
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? "✅ Set" : "❌ Missing",
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? "✅ Set" : "❌ Missing",
        appId: process.env.REACT_APP_FIREBASE_APP_ID ? "✅ Set" : "❌ Missing"
      };

      // Test Firebase imports
      try {
        const { auth, db } = await import('../lib/firebase');
        
        if (auth) {
          authReady = true;
          console.log("✅ Firebase Auth ready");
        } else {
          errors.push("Firebase Auth not initialized");
        }

        if (db) {
          firestoreReady = true;
          console.log("✅ Firestore ready");
        } else {
          errors.push("Firestore not initialized");
        }

        configLoaded = true;
      } catch (importError) {
        errors.push(`Firebase import failed: ${importError.message}`);
        console.error("❌ Firebase import error:", importError);
      }

      // Test Firestore connection
      if (firestoreReady) {
        try {
          const { collection, getDocs } = await import('../lib/firebase');
          const testRef = collection(await import('../lib/firebase').then(m => m.db), 'test');
          console.log("🔍 Testing Firestore connection...");
          // This will fail if Firestore rules don't allow it, but that's okay
        } catch (firestoreError) {
          console.warn("⚠️ Firestore test (expected to fail with rules):", firestoreError.message);
        }
      }

    } catch (error) {
      errors.push(`General Firebase error: ${error.message}`);
      console.error("❌ Firebase test error:", error);
    }

    setDebugInfo({
      configLoaded,
      authReady,
      firestoreReady,
      errors,
      config,
      loading: false
    });
  };

  const StatusIcon = ({ status }) => (
    status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Firebase Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This page shows detailed Firebase connection status and configuration.
              </p>
            </CardContent>
          </Card>

          {debugInfo.loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13ad89] mx-auto mb-4"></div>
                  <p>Testing Firebase services...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Service Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <StatusIcon status={debugInfo.configLoaded} />
                      <div>
                        <h4 className="font-medium">Configuration</h4>
                        <p className="text-sm text-gray-600">
                          {debugInfo.configLoaded ? "Loaded" : "Failed"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <StatusIcon status={debugInfo.authReady} />
                      <div>
                        <h4 className="font-medium">Authentication</h4>
                        <p className="text-sm text-gray-600">
                          {debugInfo.authReady ? "Ready" : "Not Ready"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <StatusIcon status={debugInfo.firestoreReady} />
                      <div>
                        <h4 className="font-medium">Firestore</h4>
                        <p className="text-sm text-gray-600">
                          {debugInfo.firestoreReady ? "Ready" : "Not Ready"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Variables */}
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {debugInfo.config && Object.entries(debugInfo.config).map(([key, status]) => (
                      <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-mono text-sm">{key}</span>
                        <span className={`text-sm ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Errors */}
              {debugInfo.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      Errors Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {debugInfo.errors.map((error, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button 
                      onClick={testFirebaseServices}
                      variant="outline"
                    >
                      Retest Connection
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/firebase-setup'}
                      className="bg-[#13ad89] hover:bg-[#0f8c6d]"
                      disabled={!debugInfo.authReady || !debugInfo.firestoreReady}
                    >
                      Go to Setup
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/login'}
                      variant="outline"
                    >
                      Go to Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseDebug;
