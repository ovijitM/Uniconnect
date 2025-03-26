
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles = []
}) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page if role not allowed
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
