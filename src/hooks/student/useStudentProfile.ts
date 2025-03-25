
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStudentProfile = (userId: string | undefined) => {
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const [userUniversityId, setUserUniversityId] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      setProfileFetched(true);
      return;
    }
    
    setIsLoadingProfile(true);
    try {
      console.log('Fetching user profile for userId:', userId);
      // Get the user's university
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('university, university_id')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile data:', error);
        throw error;
      }
      
      console.log('Profile data fetched:', profileData);
      
      if (profileData?.university) {
        setUserUniversity(profileData.university);
      }
      
      if (profileData?.university_id) {
        setUserUniversityId(profileData.university_id);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProfile(false);
      setProfileFetched(true);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    } else {
      setProfileFetched(true);
    }
  }, [userId, fetchUserProfile]);

  // Add a new function to get university from backend directly when needed
  const getUserUniversityFromBackend = async (): Promise<{university: string | null; universityId: string | null}> => {
    if (!userId) {
      return { university: null, universityId: null };
    }
    
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('university, university_id')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile data:', error);
        return { university: null, universityId: null };
      }
      
      return { 
        university: profileData?.university || null, 
        universityId: profileData?.university_id || null 
      };
    } catch (error) {
      console.error('Error fetching university directly:', error);
      return { university: null, universityId: null };
    }
  };

  // Add the missing updateUserUniversity function
  const updateUserUniversity = async (university: string) => {
    if (!userId) return false;

    try {
      // Check if university exists
      const { data: universityData, error: universityError } = await supabase
        .from('universities')
        .select('id')
        .eq('name', university)
        .maybeSingle();
      
      if (universityError) {
        console.error('Error checking university:', universityError);
        return false;
      }
      
      let universityId = universityData?.id;
      
      if (!universityId) {
        // Create new university if it doesn't exist
        const { data: newUniversity, error: createError } = await supabase
          .from('universities')
          .insert({ name: university })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating university:', createError);
          return false;
        }
        
        universityId = newUniversity.id;
      }
      
      // Update the user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          university: university,
          university_id: universityId,
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return false;
      }
      
      // Update local state
      setUserUniversity(university);
      setUserUniversityId(universityId);
      
      return true;
    } catch (error) {
      console.error('Error updating university:', error);
      return false;
    }
  };

  return {
    userUniversity,
    userUniversityId,
    isLoadingProfile,
    profileFetched,
    fetchUserProfile,
    getUserUniversityFromBackend,
    updateUserUniversity
  };
};
