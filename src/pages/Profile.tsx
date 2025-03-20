
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect to the appropriate dashboard based on user role
  const dashboardPath = `/${user.role.replace('_', '-')}-dashboard`;
  return <Navigate to={dashboardPath} />;
};

export default Profile;
