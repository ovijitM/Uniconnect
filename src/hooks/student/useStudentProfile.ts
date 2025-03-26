
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStudentProfile = (userId: string | undefined) => {
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const [userUniversityId, setUserUniversityId] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    
    setIsLoadingProfile(true);
    setError(null);
    
    try {
      console.log(`Fetching profile for user ${userId}`);
      
      // Get the user's university
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('university, university_id')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      if (profileData) {
        console.log('Profile data retrieved:', profileData);
        
        if (profileData.university) {
          setUserUniversity(profileData.university);
        }
        
        if (profileData.university_id) {
          setUserUniversityId(profileData.university_id);
        }

        // If we have a university but no university_id, try to find or create it
        if (profileData.university && !profileData.university_id) {
          await updateUserUniversity(profileData.university);
        }
      } else {
        console.warn('No profile data found for user:', userId);
      }
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', error);
      setError(error.message || 'Failed to load profile data');
      
      toast({
        title: 'Error',
        description: 'Failed to load profile data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [userId, toast]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
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
    } catch (error: any) {
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
    error,
    fetchUserProfile,
    updateUserUniversity
  };
};
