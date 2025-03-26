
import React from 'react';
import Home from './Home';
import { useAuthFallback } from '@/hooks/useAuthFallback';

const Index: React.FC = () => {
  // Initialize auth fallback to handle cases where AuthContext might not be available
  useAuthFallback();
  
  return <Home />;
};

export default Index;
