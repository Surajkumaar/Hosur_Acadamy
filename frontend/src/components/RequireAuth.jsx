import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User's role is not authorized, redirect to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
