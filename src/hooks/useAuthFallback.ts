
import { useState, useEffect } from 'react';
import { AuthState } from '@/types/auth';

export const useAuthFallback = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Try to get user from localStorage as fallback
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  return {
    user,
    isLoading: false,
    error: null
  };
};
