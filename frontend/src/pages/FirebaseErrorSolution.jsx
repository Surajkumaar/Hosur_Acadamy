import React from 'react';
import { Button } from '../components/ui/button';
import { AlertTriangle, ExternalLink, Copy } from 'lucide-react';

const FirebaseErrorSolution = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const newFirebaseConfig = `# Replace your current Firebase configuration in .env with:
REACT_APP_FIREBASE_API_KEY=your_new_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id`;

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-2">Firebase Configuration Error</h1>
          <p className="text-gray-600">auth/configuration-not-found</p>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">What's Wrong?</h2>
            <p className="text-yellow-700">
              Your Firebase project <code>acadamy-a1ba9</code> is not accessible. This usually means:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-700">
              <li>The project was deleted or doesn't exist</li>
              <li>The API key is invalid</li>
              <li>The project is not properly configured</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">🔧 How to Fix This</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium text-blue-800">Create a New Firebase Project</p>
                  <a 
                    href="https://console.firebase.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                  >
                    Go to Firebase Console <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-medium text-blue-800">Enable Authentication</p>
                  <p className="text-blue-700 text-sm">Go to Authentication → Sign-in method → Enable Email/Password</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-medium text-blue-800">Get Configuration</p>
                  <p className="text-blue-700 text-sm">Project Settings → Your apps → Web app → Copy config</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-medium text-blue-800">Update .env File</p>
                  <div className="mt-2 bg-gray-100 rounded p-3 text-sm">
                    <pre className="whitespace-pre-wrap text-gray-800">{newFirebaseConfig}</pre>
                  </div>
                  <Button 
                    onClick={() => copyToClipboard(newFirebaseConfig)} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Template
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Test Credentials</h2>
            <p className="text-green-700 mb-2">Once your Firebase project is set up, create these test users:</p>
            <div className="space-y-1 text-sm text-green-700">
              <div><strong>Admin:</strong> admin@hosuracademy.com / admin123</div>
              <div><strong>Student:</strong> student@hosuracademy.com / student123</div>
              <div><strong>Test:</strong> test@hosuracademy.com / test123</div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1"
            >
              Retry After Setup
            </Button>
            <Button 
              onClick={() => window.open('/firebase-test', '_blank')} 
              variant="outline"
              className="flex-1"
            >
              Open Test Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseErrorSolution;
