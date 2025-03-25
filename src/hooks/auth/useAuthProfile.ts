
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState } from '@/types/auth';

export const useAuthProfile = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
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

  return { updateUser };
};
