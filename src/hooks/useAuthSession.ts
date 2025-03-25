
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
      console.log("Fetching user profile for session user:", session.user.id);
      console.log("User metadata:", session.user.user_metadata);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*, universities(*)')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log("Profile loaded:", profile);
      
      const userMetadata = session.user.user_metadata;
      let needsUpdate = false;
      let updateData: any = {};
      
      // If role in metadata doesn't match profile, update the profile
      if (userMetadata?.role && profile.role !== userMetadata.role) {
        console.log(`Role mismatch - metadata: ${userMetadata.role}, profile: ${profile.role}`);
        updateData.role = userMetadata.role;
        needsUpdate = true;
      }
      
      // If university in metadata but not in profile, update the profile
      if (userMetadata?.university && profile.university !== userMetadata.university) {
        console.log(`University mismatch - metadata: ${userMetadata.university}, profile: ${profile.university}`);
        updateData.university = userMetadata.university;
        needsUpdate = true;
      }
      
      // If university_id in metadata but not in profile, update the profile
      if (userMetadata?.university_id && profile.university_id !== userMetadata.university_id) {
        console.log(`University ID mismatch - metadata: ${userMetadata.university_id}, profile: ${profile.university_id}`);
        updateData.university_id = userMetadata.university_id;
        needsUpdate = true;
      }
      
      // Update profile if needed
      if (needsUpdate) {
        console.log("Updating profile with:", updateData);
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', session.user.id);
          
        if (updateError) {
          console.warn('Failed to update profile with metadata values:', updateError);
        } else {
          // Update local profile object with the changes
          Object.assign(profile, updateData);
          console.log("Profile updated with metadata values");
        }
      }
      
      // If university_id is not present but university is, try to fetch or create university_id
      if (profile.university && !profile.university_id) {
        console.log("University present but no university_id, will try to fetch or create it");
        
        const { data: uniData, error: uniError } = await supabase
          .from('universities')
          .select('id')
          .eq('name', profile.university)
          .maybeSingle();
        
        if (uniError) {
          console.warn('Error checking university:', uniError);
        } else if (uniData) {
          // University exists, update profile with university_id
          const { error: updateUniError } = await supabase
            .from('profiles')
            .update({ university_id: uniData.id })
            .eq('id', session.user.id);
            
          if (updateUniError) {
            console.warn('Failed to update profile with university_id:', updateUniError);
          } else {
            profile.university_id = uniData.id;
            console.log("Updated profile with existing university_id:", uniData.id);
          }
        } else {
          // University doesn't exist, create it
          const { data: newUni, error: createUniError } = await supabase
            .from('universities')
            .insert({ name: profile.university })
            .select()
            .single();
          
          if (createUniError) {
            console.warn('Error creating university:', createUniError);
          } else if (newUni) {
            // Update profile with new university_id
            const { error: updateNewUniError } = await supabase
              .from('profiles')
              .update({ university_id: newUni.id })
              .eq('id', session.user.id);
              
            if (updateNewUniError) {
              console.warn('Failed to update profile with new university_id:', updateNewUniError);
            } else {
              profile.university_id = newUni.id;
              console.log("Updated profile with new university_id:", newUni.id);
            }
          }
        }
      }
      
      const user: User = {
        id: session.user.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        profileImage: profile.profile_image,
        university: profile.university,
        universityId: profile.university_id
      };
      
      console.log("Final user object:", user);
      
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
