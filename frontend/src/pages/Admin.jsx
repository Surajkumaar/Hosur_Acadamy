import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LogOut, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { showNotification } from '../lib/firebase';
import { 
  db, 
  collection, 
  getDocs, 
  query, 
  where 
} from '../lib/firebase';

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading, logout } = useAuth();
  const hasRunEffect = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [publishedResults, setPublishedResults] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
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

  // Function to fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      console.log("📊 Fetching dashboard statistics...");

      // Count total students from users collection
      const usersRef = collection(db, 'users');
      const studentsQuery = query(usersRef, where('role', '==', 'student'));
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentCount = studentsSnapshot.size;
      
      console.log(`👥 Found ${studentCount} students`);
      setTotalStudents(studentCount);

      // Count published exam results
      const examResultsRef = collection(db, 'examResults');
      const examResultsSnapshot = await getDocs(examResultsRef);
      const resultsCount = examResultsSnapshot.size;
      
      console.log(`📋 Found ${resultsCount} published results`);
      setPublishedResults(resultsCount);

    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      
      // Fallback to show 0 if there's an error
      setTotalStudents(0);
      setPublishedResults(0);
      
      showNotification(toast, {
        title: "Stats Error",
        description: "Could not load dashboard statistics. Please refresh the page.",
        type: "error"
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Add event listener for storage events to refresh stats when data changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin_dashboard_refresh') {
        console.log("🔄 Dashboard refresh triggered by another component");
        fetchDashboardStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
        // Fetch dashboard statistics once admin access is confirmed
        fetchDashboardStats();
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
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          {/* Header with User Info and Logout */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b border-gray-200 space-y-4 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1 truncate">Welcome back, {currentUser?.email}</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm font-medium">{userProfile?.role || 'Admin'}</span>
              </div>
              <Button
                onClick={fetchDashboardStats}
                disabled={statsLoading}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 px-2 sm:px-4"
                title="Refresh Statistics"
              >
                <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline ml-2">Refresh</span>
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
              <h3 className="text-base md:text-lg font-semibold text-blue-900">Total Students</h3>
              {statsLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-blue-600"></div>
                  <span className="text-sm md:text-base text-blue-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{totalStudents}</p>
              )}
            </div>
            <div className="bg-purple-50 p-4 md:p-6 rounded-lg">
              <h3 className="text-base md:text-lg font-semibold text-purple-900">Published Results</h3>
              {statsLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-purple-600"></div>
                  <span className="text-sm md:text-base text-purple-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-purple-600">{publishedResults}</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Link to="/admin/manage-students" className="block">
                  <Button
                    variant="outline"
                    className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white p-3 md:p-4 h-auto w-full"
                  >
                    <div className="text-left w-full">
                      <h3 className="font-semibold text-sm md:text-base">Manage Students</h3>
                      <p className="text-xs md:text-sm opacity-75 mt-1">View and edit student records</p>
                    </div>
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/admin/publish-results" className="block">
                  <Button
                    variant="outline"
                    className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white p-3 md:p-4 h-auto w-full"
                  >
                    <div className="text-left w-full">
                      <h3 className="font-semibold text-sm md:text-base">Publish Results</h3>
                      <p className="text-xs md:text-sm opacity-75 mt-1">Upload and publish exam results</p>
                    </div>
                  </Button>
                </Link>
              </div>
              <div>
                <Link to="/admin/manage-results" className="block">
                  <Button
                    variant="outline"
                    className="border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white p-3 md:p-4 h-auto w-full"
                  >
                    <div className="text-left w-full">
                      <h3 className="font-semibold text-sm md:text-base">Manage Results</h3>
                      <p className="text-xs md:text-sm opacity-75 mt-1">View and delete published results</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
