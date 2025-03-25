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
      
      if (university && university.trim() !== '') {
        const { data: existingUni, error: uniCheckError } = await supabase
          .from('universities')
          .select('id')
          .eq('name', university)
          .maybeSingle();
        
        if (uniCheckError && !uniCheckError.message.includes('No rows found')) {
          console.warn('Error checking university:', uniCheckError);
        }
        
        if (!existingUni) {
          const { error: uniInsertError } = await supabase
            .from('universities')
            .insert({
              name: university
            });
          
          if (uniInsertError && !uniInsertError.message.includes('unique constraint')) {
            console.warn('Error adding university:', uniInsertError);
          }
        }
      }
      
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
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.warn('Profile not found immediately after signup, this is normal if confirmations are enabled');
        
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
      
      const updatedUser = authState.user ? { ...authState.user, ...userData } : null;
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
      
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
