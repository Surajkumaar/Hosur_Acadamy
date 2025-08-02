import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth = ({ children, allowedRoles }) => {
  const { currentUser, userProfile, loading } = useAuth();

  // Show loading spinner while checking authentication
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

  // Check Firebase authentication only
  if (!currentUser) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!userProfile || !allowedRoles.includes(userProfile.role))) {
    // User's role is not authorized, redirect based on their role
    if (userProfile?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  return children;
};

// Specific component for admin routes
export const AdminRoute = ({ children }) => {
  return (
    <RequireAuth allowedRoles={['admin']}>
      {children}
    </RequireAuth>
  );
};

// Specific component for authenticated routes (any role)
export const AuthenticatedRoute = ({ children }) => {
  return (
    <RequireAuth>
      {children}
    </RequireAuth>
  );
};

export default RequireAuth;
