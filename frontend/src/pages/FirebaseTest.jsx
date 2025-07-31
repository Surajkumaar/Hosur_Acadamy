import React, { useEffect, useState } from 'react';
import { app, auth, db, analytics, collection, getDocs } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { runAuthTest, createTestUser, testLogin } from '../utils/auth-debug';
import { createAdminUser, getAdminCreationInstructions } from '../utils/admin-utils';

const FirebaseTest = () => {
  const [authStatus, setAuthStatus] = useState('Checking...');
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [analyticsStatus, setAnalyticsStatus] = useState('Checking...');
  const [appStatus, setAppStatus] = useState('Checking...');
  const [loginStatus, setLoginStatus] = useState('Not tested');
  const [loginEmail, setLoginEmail] = useState('test@hosuracademy.com');
  const [loginPassword, setLoginPassword] = useState('test123');
  const [debugOutput, setDebugOutput] = useState('');
  
  useEffect(() => {
    // Test Firebase App initialization
    try {
      if (app) {
        console.log("Firebase app config:", app.options);
        setAppStatus('Firebase app initialized ✅');
      } else {
        setAppStatus('Failed to initialize Firebase app ❌');
      }
    } catch (error) {
      console.error('Firebase app error:', error);
      setAppStatus(`Error: ${error.message}`);
    }
    
    // Test Firebase Authentication
    try {
      if (auth) {
        console.log("Auth instance:", auth);
        setAuthStatus('Auth initialized ✅');
      } else {
        setAuthStatus('Failed to initialize Auth ❌');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthStatus(`Error: ${error.message}`);
    }
    
    // Test Firebase Firestore
    const testFirestore = async () => {
      try {
        // Just try to get a collection to see if Firestore is working
        const querySnapshot = await getDocs(collection(db, 'test-collection'));
        setDbStatus('Connected ✅');
      } catch (error) {
        console.error('Firestore error:', error);
        // If the error is about permissions, that's actually good - it means Firestore is connected
        if (error.code === 'permission-denied') {
          setDbStatus('Connected (permission denied) ✅');
        } else {
          setDbStatus(`Error: ${error.message}`);
        }
      }
    };
    
    testFirestore();
    
    // Test Firebase Analytics
    try {
      if (analytics) {
        setAnalyticsStatus('Connected ✅');
      } else {
        setAnalyticsStatus('Failed to connect ❌');
      }
    } catch (error) {
      console.error('Analytics error:', error);
      setAnalyticsStatus(`Error: ${error.message}`);
    }
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus('Attempting login...');
    
    try {
      console.log("Attempting login with auth:", auth);
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log("Login successful:", userCredential.user);
      setLoginStatus(`Login successful: ${userCredential.user.email}`);
    } catch (error) {
      console.error("Login error:", error);
      setLoginStatus(`Login failed: ${error.code} - ${error.message}`);
    }
  };

  const runCompleteTest = async () => {
    setDebugOutput('Running complete Firebase test...\n');
    
    // Capture console output
    const originalLog = console.log;
    const logs = [];
    
    console.log = (...args) => {
      originalLog(...args);
      logs.push(args.join(' '));
    };
    
    try {
      await runAuthTest();
      setDebugOutput(logs.join('\n'));
      setLoginStatus('Test completed - check debug output');
    } catch (error) {
      setDebugOutput(logs.join('\n') + '\nError: ' + error.message);
      setLoginStatus('Test failed - check debug output');
    } finally {
      console.log = originalLog;
    }
  };

  const createAdminAccount = async () => {
    setLoginStatus('Creating admin account...');
    
    try {
      const result = await createAdminUser('admin@hosuracademy.com', 'admin123', 'Admin User');
      if (result.success) {
        setLoginStatus(`Admin account created: admin@hosuracademy.com / admin123`);
        setLoginEmail('admin@hosuracademy.com');
        setLoginPassword('admin123');
      } else {
        setLoginStatus(`Failed: ${result.error}`);
      }
    } catch (error) {
      setLoginStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Firebase Connection Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-lg">Firebase App</h3>
          <p className="mt-2">{appStatus}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-lg">Authentication</h3>
          <p className="mt-2">{authStatus}</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-lg">Firestore Database</h3>
          <p className="mt-2">{dbStatus}</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-lg">Analytics</h3>
          <p className="mt-2">{analyticsStatus}</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-lg">Test Login</h3>
          <div className="mt-2 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={createAdminAccount} className="flex-1">
                Create Admin User
              </Button>
              <Button onClick={runCompleteTest} variant="outline" className="flex-1">
                Run Full Test
              </Button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Test Login
              </Button>
            </form>
            
            <div className="mt-2">
              <p><strong>Status:</strong> {loginStatus}</p>
            </div>
            
            {debugOutput && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-medium mb-2">Debug Output:</h4>
                <pre className="text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {debugOutput}
                </pre>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">🔑 Admin Access Instructions:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>1. Create Admin User:</strong> Click "Create Admin User" above</p>
                <p><strong>2. Login Credentials:</strong> admin@hosuracademy.com / admin123</p>
                <p><strong>3. Admin Dashboard:</strong> After login, you'll be redirected to /admin</p>
                <p><strong>4. Manual Setup:</strong> Or create via Firebase Console → Users → Add User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={() => window.location.reload()}
          className="w-full"
        >
          Refresh Test
        </Button>
      </div>
    </div>
  );
};

export default FirebaseTest;
