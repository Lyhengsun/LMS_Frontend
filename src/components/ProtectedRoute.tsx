
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from '@/src/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'instructor' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = getUserRole();
  
  console.log('ProtectedRoute - isLoggedIn:', isLoggedIn, 'userRole:', userRole, 'requiredRole:', requiredRole);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'instructor':
        return <Navigate to="/instructor-dashboard" replace />;
      case 'student':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
