
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
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (session) {
        await fetchUserProfile(session);
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error getting session:', error);
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
        setAuthState(prev => ({ ...prev, isLoading: true }));

        if (session) {
          await fetchUserProfile(session);
        } else {
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
