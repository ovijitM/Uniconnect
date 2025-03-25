
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

  const updateUserUniversity = async (university: string) => {
    if (!userId) return false;
    
    try {
      // First, look up the university ID
      let universityId = null;
      
      const { data: universityData, error: universityError } = await supabase
        .from('universities')
        .select('id')
        .eq('name', university)
        .maybeSingle();
      
      if (universityError) throw universityError;
      
      if (universityData) {
        universityId = universityData.id;
      } else {
        // If university doesn't exist, create it
        const { data: newUniversity, error: createError } = await supabase
          .from('universities')
          .insert({ name: university })
          .select()
          .single();
        
        if (createError) throw createError;
        
        if (newUniversity) {
          universityId = newUniversity.id;
        }
      }
      
      // Update the profile with both university name and ID
      const { error } = await supabase
        .from('profiles')
        .update({ 
          university: university,
          university_id: universityId
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      setUserUniversity(university);
      setUserUniversityId(universityId);
      
      toast({
        title: 'Success',
        description: 'University updated successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating university:', error);
      toast({
        title: 'Error',
        description: 'Failed to update university',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    userUniversity,
    userUniversityId,
    isLoadingProfile,
    profileFetched,
    fetchUserProfile,
    updateUserUniversity
  };
};
