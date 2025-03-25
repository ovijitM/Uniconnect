
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
      let universityId = null;
      if (university && university.trim() !== '') {
        const { data: existingUni, error: uniCheckError } = await supabase
          .from('universities')
          .select('id')
          .eq('name', university)
          .maybeSingle();
        
        if (uniCheckError) {
          console.warn('Error checking university:', uniCheckError);
        }
        
        if (existingUni) {
          universityId = existingUni.id;
          console.log('Found existing university with ID:', universityId);
        } else {
          // Insert a new university if it doesn't exist
          const { data: newUni, error: uniInsertError } = await supabase
            .from('universities')
            .insert({
              name: university
            })
            .select()
            .single();
          
          if (uniInsertError) {
            console.warn('Error adding university:', uniInsertError);
          } else if (newUni) {
            universityId = newUni.id;
            console.log('Created new university with ID:', universityId);
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
            university,
            university_id: universityId
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the profile that was created by the auth trigger
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.warn('Profile not found after signup, will create one:', profileError);
        
        // If profile doesn't exist, create it manually
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || email,
            name,
            role,
            university,
            university_id: universityId
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Failed to create profile:', createError);
        } else {
          profile = newProfile;
          console.log("Profile created manually:", profile);
        }
      } else {
        console.log("Existing profile found:", profile);
      }
      
      // Always update the profile with the correct role and university from signup
      console.log("Updating profile with role:", role, "university:", university, "university_id:", universityId);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: role,
          university: university,
          university_id: universityId
        })
        .eq('id', data.user.id);
      
      if (updateError) {
        console.error('Failed to update profile with role and university:', updateError);
      } else {
        console.log("Profile updated successfully with role and university");
      }
      
      // Fetch the final updated profile to confirm all changes
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (fetchError) {
        console.error('Failed to fetch updated profile:', fetchError);
        
        // Create a user object with the expected structure even if fetching profile fails
        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name,
          role, // Use the role from signup parameters
          university, // Use the university from signup parameters
          universityId, // Add the university ID
          profileImage: undefined
        };
        
        setAuthState({
          user,
          isLoading: false,
          error: null
        });
        
        return user;
      }
      
      console.log("Final updated profile:", updatedProfile);
      
      // Create a user object with the correct data
      const user: User = {
        id: data.user.id,
        email: updatedProfile.email,
        name: updatedProfile.name,
        role: updatedProfile.role, // Use the role from the updated profile
        profileImage: updatedProfile.profile_image,
        university: updatedProfile.university, // Use the university from the updated profile
        universityId: updatedProfile.university_id // Include the university ID
      };
      
      console.log("Final user object returned:", user);
      
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
