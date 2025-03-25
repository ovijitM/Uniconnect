import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthState } from '@/types/auth';

export interface AuthActions {
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole, university?: string) => Promise<User>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthActions = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
): AuthActions => {
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.session) {
        throw new Error('No session returned after login');
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      const user: User = {
        id: data.user.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        profileImage: profile.profile_image,
        university: profile.university
      };
      
      setAuthState({
        user,
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole, university?: string): Promise<User> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            university
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned after signup');
      }
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        // This can happen if the trigger hasn't run yet
        console.warn('Profile not found immediately after signup, this is normal if confirmations are enabled');
        
        // Create a user object based on the signup data
        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name,
          role,
          university,
          profileImage: undefined
        };
        
        setAuthState({
          user,
          isLoading: false,
          error: null
        });
        
        return user;
      }
      
      const user: User = {
        id: data.user.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        profileImage: profile.profile_image,
        university: profile.university
      };
      
      setAuthState({
        user,
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear stored user on logout
      localStorage.removeItem('authUser');
      setAuthState({ user: null, isLoading: false, error: null });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!authState.user) {
        return;
      }
      
      // Update profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          profile_image: userData.profileImage,
          university: userData.university,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedUser = authState.user ? { ...authState.user, ...userData } : null;
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
      // Update stored user
      if (updatedUser) {
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return {
    login,
    signup,
    logout,
    updateUser
  };
};
