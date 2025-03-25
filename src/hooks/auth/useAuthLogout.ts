
import { supabase } from '@/integrations/supabase/client';
import { AuthState } from '@/types/auth';

export const useAuthLogout = (
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('authUser');
      setAuthState({ user: null, isLoading: false, error: null });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { logout };
};
