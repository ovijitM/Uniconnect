
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

export const useAuthSession = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  const fetchUserProfile = async (session: Session) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      const user: User = {
        id: session.user.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        profileImage: profile.profile_image
      };
      
      setAuthState({
        user,
        isLoading: false,
        error: null
      });

      // Store user in localStorage for persistence
      localStorage.setItem('authUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error fetching profile'
      });
    }
  };

  const checkCurrentSession = async () => {
    try {
      // First try to get user from localStorage to prevent flashing
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setAuthState({
          user: JSON.parse(storedUser),
          isLoading: true, // Still loading because we need to verify with Supabase
          error: null
        });
      }

      // Then verify with Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session) {
        await fetchUserProfile(session);
      } else {
        // Clear stored user if no valid session
        localStorage.removeItem('authUser');
        setAuthState({
          user: null,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error getting session:', error);
      // Clear stored user on error
      localStorage.removeItem('authUser');
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error checking session'
      });
    }
  };

  useEffect(() => {
    // Check if user is already logged in using Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        if (session) {
          await fetchUserProfile(session);
        } else if (event === 'SIGNED_OUT') {
          // Only clear user on explicit sign out
          localStorage.removeItem('authUser');
          setAuthState({
            user: null,
            isLoading: false,
            error: null
          });
        }
      }
    );

    // Initial session check
    checkCurrentSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    authState,
    setAuthState
  };
};
