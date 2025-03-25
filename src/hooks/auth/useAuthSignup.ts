
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, AuthState } from '@/types/auth';

export const useAuthSignup = (
  authState: AuthState,
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>
) => {
  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole, 
    university?: string
  ): Promise<User> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log("Starting signup with role:", role, "university:", university);
      
      // If university is provided, check if it exists in the database
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
      
      // Sign up the user with auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            university  // Make sure university is included in the metadata
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error('No user returned after signup');
      }
      
      console.log("User created with metadata:", data.user.user_metadata);
      
      // Delay slightly to ensure the database trigger has time to create the profile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if profile was created and has correct data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.warn('Profile not found after signup:', profileError);
        
        // Create a user object with the expected structure
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
      
      // Explicitly update the profile with the correct role and university
      console.log("Profile found:", profile);
      console.log("Explicitly updating profile with role:", role, "university:", university);
      
      const updateData: any = {
        role: role
      };
      
      if (university) {
        updateData.university = university;
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', data.user.id);
      
      if (updateError) {
        console.warn('Failed to update profile:', updateError);
      } else {
        console.log("Profile updated successfully with role and university");
      }
      
      // Fetch the updated profile to confirm changes
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (fetchError) {
        console.warn('Failed to fetch updated profile:', fetchError);
      } else {
        console.log("Updated profile:", updatedProfile);
      }
      
      // Create a user object with the correct data
      const user: User = {
        id: data.user.id,
        email: profile.email,
        name: profile.name,
        role: role, // Explicitly use the role passed to signup
        profileImage: profile.profile_image,
        university: university // Explicitly use the university passed to signup
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

  return { signup };
};
