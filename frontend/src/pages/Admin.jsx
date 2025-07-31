import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { showNotification } from '../lib/firebase';

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading, logout } = useAuth();
  const hasRunEffect = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result.success) {
        console.log("✅ Logout successful");
        
        showNotification(toast, {
          title: "Logout Successful",
          description: "You have been successfully logged out.",
          type: "default"
        });
        
        // Navigate after a brief delay to show the toast
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        console.error("❌ Logout failed:", result.error);
        
        showNotification(toast, {
          title: "Logout Failed",
          description: result.error || "An error occurred while logging out.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      
      showNotification(toast, {
        title: "Logout Error",
        description: "An unexpected error occurred while logging out.",
        type: "error"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    // Prevent multiple executions
    if (hasRunEffect.current) return;
    
    console.log("🔍 Admin component - checking access");
    console.log("  Loading:", loading);
    console.log("  Current user:", currentUser?.email || 'none');
    console.log("  User profile:", userProfile);
    console.log("  User role:", userProfile?.role || 'none');
    
    if (!loading) {
      hasRunEffect.current = true;
      
      if (!currentUser) {
        console.log("❌ No user, redirecting to login");
        navigate('/login');
      } else if (userProfile && userProfile.role !== 'admin') {
        console.log("❌ User is not admin, redirecting to home");
        navigate('/'); // Redirect non-admin users to home
      } else if (!userProfile) {
        console.log("❌ No user profile found, redirecting to login");
        navigate('/login');
      } else {
        console.log("✅ Admin access granted");
      }
    }
  }, [currentUser, userProfile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0052CC]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !userProfile || userProfile.role !== 'admin') {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header with User Info and Logout */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {currentUser?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{userProfile?.role || 'Admin'}</span>
              </div>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">150</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Active Courses</h3>
              <p className="text-3xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Published Results</h3>
              <p className="text-3xl font-bold text-purple-600">8</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Link to="/admin/manage-students" className="block">
                  <Button
                    variant="outline"
                    className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white p-4 h-auto w-full"
                  >
                    <div className="text-left">
                      <h3 className="font-semibold">Manage Students</h3>
                      <p className="text-sm opacity-75">View and edit student records</p>
                    </div>
                  </Button>
                </Link>
              </div>
              <div>
                <Button
                  variant="outline"
                  className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white p-4 h-auto w-full"
                >
                  <div className="text-left">
                    <h3 className="font-semibold">Manage Courses</h3>
                    <p className="text-sm opacity-75">Add or modify course details</p>
                  </div>
                </Button>
              </div>
              <div>
                <Link to="/admin/publish-results" className="block">
                  <Button
                    variant="outline"
                    className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white p-4 h-auto w-full"
                  >
                    <div className="text-left">
                      <h3 className="font-semibold">Publish Results</h3>
                      <p className="text-sm opacity-75">Upload and publish exam results</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-medium">New Student Registration</h4>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-[#0052CC] hover:text-[#0052CC] hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
