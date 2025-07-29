import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      // Mock authentication - replace with actual API call
      try {
        // Mock student credentials check
        if (formData.email.includes('student')) {
          // Example: student.2025jee0001@hosur.edu
          const rollNumber = formData.email.split('.')[1].split('@')[0].toUpperCase();
          login({
            email: formData.email,
            role: 'student',
            rollNumber: rollNumber
          });
          navigate('/results');
        } else if (formData.email.includes('admin')) {
          login({
            email: formData.email,
            role: 'admin'
          });
          navigate('/admin');
        } else {
          login({
            email: formData.email,
            role: 'user'
          });
          navigate('/');
        }
      } catch (err) {
        setError('Invalid credentials');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section with Image and Text */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#13ad89] text-white p-12 flex-col justify-center">
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
            <div className="w-12 h-12 bg-gradient-to-br from-[#0052CC] to-[#39C93D] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-center text-sm">
                {error}
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#13ad89] focus:border-transparent"
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#13ad89] focus:border-transparent"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#13ad89] focus:ring-[#13ad89] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Keep me logged in
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#13ad89] hover:text-[#0f8c6d]">
                  Forgot Password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#13ad89] hover:bg-[#0f8c6d] text-white py-3 rounded-lg transition-colors"
            >
              Sign In
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
