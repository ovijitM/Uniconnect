
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export const useAuthProfile = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const { toast } = useToast();

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
          university_id: userData.universityId,
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
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  return { updateUser };
};
