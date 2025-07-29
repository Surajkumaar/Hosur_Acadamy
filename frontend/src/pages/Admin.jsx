import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has admin rights
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
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
