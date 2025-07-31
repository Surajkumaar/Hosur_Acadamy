import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { validateEnvironmentVariables } from './utils/firebase-test';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Gallery from './pages/Gallery';
import Toppers from './pages/Toppers';
import Inquiry from './pages/Inquiry';
import Login from './pages/Login';
import Register from './pages/Register';
import FirebaseTest from './pages/FirebaseTest';
import Admin from './pages/Admin';
import UserDebug from './pages/UserDebug';
import { AdminRoute } from './components/RequireAuth';

function App() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  useEffect(() => {
    // Validate Firebase configuration on app startup
    try {
      const isValid = validateEnvironmentVariables();
      if (isValid) {
        setIsFirebaseReady(true);
        console.log("✓ Firebase configuration is valid");
      } else {
        setFirebaseError("Firebase configuration is incomplete");
      }
    } catch (error) {
      console.error("Firebase validation error:", error);
      setFirebaseError(error.message);
    }
  }, []);

  if (firebaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-700 mb-4">{firebaseError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/toppers" element={<Toppers />} />
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/login" element={
                // Wrap Login in a container to ensure proper spacing
                <div className="login-container">
                  <Login />
                </div>
              } />
              <Route path="/register" element={
                <div className="register-container">
                  <Register />
                </div>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
              <Route path="/firebase-test" element={<FirebaseTest />} />
              <Route path="/user-debug" element={<UserDebug />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;