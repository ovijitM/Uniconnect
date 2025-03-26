
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
      
      // If university is provided but universityId is not, fetch or create the university ID
      let universityId = userData.universityId;
      if (userData.university && !universityId) {
        // Check if university exists
        const { data: universityData, error: universityError } = await supabase
          .from('universities')
          .select('id')
          .eq('name', userData.university)
          .maybeSingle();
        
        if (universityError) {
          console.warn('Error checking university:', universityError);
        }
        
        if (universityData) {
          universityId = universityData.id;
        } else {
          // Create new university if it doesn't exist
          const { data: newUniversity, error: createError } = await supabase
            .from('universities')
            .insert({ name: userData.university })
            .select()
            .single();
          
          if (createError) {
            console.warn('Error creating university:', createError);
          } else if (newUniversity) {
            universityId = newUniversity.id;
          }
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          profile_image: userData.profileImage,
          university: userData.university,
          university_id: universityId,
          updated_at: new Date().toISOString()
        })
        .eq('id', authState.user.id);
      
      if (error) {
        throw error;
      }
      
      const updatedUser = authState.user ? { 
        ...authState.user, 
        ...userData,
        universityId: universityId || authState.user.universityId 
      } : null;
      
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
