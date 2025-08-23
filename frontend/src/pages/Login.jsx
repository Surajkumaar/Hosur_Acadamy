import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showNotification } from '../lib/firebase';
import { useToast } from '../hooks/use-toast';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { login, currentUser, userProfile, isFirebaseReady, authError } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      // Redirect based on user role
      if (userProfile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    
    // Show Firebase authentication service error if it exists
    if (authError && !isFirebaseReady) {
      setError('Authentication service unavailable. Please try again later or contact support.');
    }
  }, [currentUser, userProfile, navigate, authError, isFirebaseReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log("Login form submitted:", formData.email);
    
    // Check if Firebase is ready before attempting login
    if (!isFirebaseReady) {
      setError('Authentication service unavailable. Please try again later or contact support.');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await login(formData.email, formData.password);
      console.log("Firebase login result:", result);
      
      if (result.success) {
        console.log("✅ Firebase Login successful, user:", result.user);
        
        showNotification(toast, {
          title: "Login Successful",
          description: "Welcome back to Hosur Academy!",
          type: "default"
        });
        
        // Wait a moment for the auth context to update with user profile
        setTimeout(async () => {
          try {
            const { getUserProfile, createUserProfile } = await import('../lib/user-profile');
            let profile = await getUserProfile(result.user.uid);
            
            // If no profile exists, create one with default role
            if (!profile) {
              console.log("🔧 No user profile found, creating one...");
              
              // Determine role based on email (simple admin detection)
              const isAdmin = formData.email.toLowerCase().includes('admin') || 
                             formData.email.toLowerCase() === 'admin@hosuracademy.com' ||
                             formData.email.toLowerCase() === 'hosurtoppersacademy@gmail.com';
              
              profile = await createUserProfile(result.user, {
                displayName: result.user.displayName || result.user.email,
                role: isAdmin ? 'admin' : 'student'
              });
              
              console.log("✅ Created user profile:", profile);
            }
            
            console.log("👤 User profile:", profile);
            
            // Redirect based on role
            if (profile && profile.role === 'admin') {
              console.log("🔑 Redirecting to admin dashboard");
              navigate('/admin');
            } else {
              console.log("🏠 Redirecting to student dashboard");
              navigate('/student-dashboard');
            }
          } catch (error) {
            console.error("❌ Error with user profile:", error);
            
            // If Firestore is not set up, skip profile check and redirect based on email
            if (error.message.includes('Firestore') || error.message.includes('database')) {
              console.log("⚠️ Firestore not set up, using email-based admin detection");
              if (formData.email.toLowerCase().includes('admin') || 
                  formData.email.toLowerCase() === 'admin@hosuracademy.com' ||
                  formData.email.toLowerCase() === 'hosurtoppersacademy@gmail.com') {
                console.log("🔑 Email suggests admin, redirecting to admin dashboard");
                navigate('/admin');
              } else {
                console.log("🏠 Redirecting to student dashboard (fallback)");
                navigate('/student-dashboard');
              }
            } else {
              console.log("🏠 Redirecting to student dashboard (fallback)");
              navigate('/student-dashboard'); // Default redirect for students
            }
          }
        }, 500);
      } else {
        // Display different messages based on error code
        let errorMessage = result.error || 'Failed to sign in';
        
        if (result.errorCode === 'auth/user-not-found') {
          errorMessage = 'No account found with this email. Please register first.';
        } else if (result.errorCode === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (result.errorCode === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (result.errorCode === 'auth/configuration-not-found' || result.errorCode === 'auth/service-unavailable') {
          errorMessage = 'Authentication service unavailable. Please try again later or contact support.';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Login component error:", err);
      setError('Authentication service unavailable. Please try again later or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen flex overflow-hidden"> 
      {/* Left Section with Image and Text */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0052CC] via-[#002357] to-[#0052CC] text-white p-12 flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Let's Grow Up Your Future With Hosur Academy</h1>
          <p className="text-lg mb-4">Learn important new skills, discover passions</p>
          <p className="text-lg">or hobbies, find ideas to change your careers.</p>
        </div>
      </div>

      {/* Right Section with Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12 text-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 p-2 shadow-lg">
              <img 
                src="/sub.png" 
                alt="Hosur Academy" 
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Students:</strong> Use your date of birth as password (format: YYYY-MM-DD, e.g., 2000-01-15)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0052CC] hover:bg-[#002357] text-white py-3 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            © 2025 Hosur Academy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
