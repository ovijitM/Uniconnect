
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isNetworkError } from '@/hooks/club-admin/utils/dataTransformUtils';

export const useStudentProfile = (userId: string | undefined) => {
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const [userUniversityId, setUserUniversityId] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    
    // Don't attempt if we've already hit the retry limit
    if (retryCount >= MAX_RETRIES) {
      setError(`Failed to load profile after ${MAX_RETRIES} attempts. Please try again later.`);
      if (!userUniversity && !userUniversityId) {
        toast({
          title: 'Error',
          description: `Failed to load profile after ${MAX_RETRIES} attempts. Please try again later.`,
          variant: 'destructive',
        });
      }
      return;
    }
    
    setIsLoadingProfile(true);
    setError(null);
    
    try {
      console.log(`Fetching profile for user ${userId} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      
      // Get the user's university
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('university, university_id')
        .eq('id', userId)
        .maybeSingle(); // Using maybeSingle instead of single to handle no results gracefully
        
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
        
        // Reset retry count on success
        setRetryCount(0);
      } else {
        console.warn('No profile data found for user:', userId);
      }
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', error);
      setError(error.message || 'Failed to load profile data');
      
      // Only retry for network errors, not for other types of errors
      if (isNetworkError(error) && retryCount < MAX_RETRIES - 1) {
        // Show toast only on first attempt
        if (retryCount === 0) {
          toast({
            title: 'Connection Error',
            description: 'Failed to load profile data. Will retry automatically.',
            variant: 'destructive',
          });
        }
        
        // Use exponential backoff for retries
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
        console.log(`Will retry in ${retryDelay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Schedule retry with incremented count
        setTimeout(() => {
          setRetryCount(prevCount => prevCount + 1);
        }, retryDelay);
      } else {
        // Final error notification if max retries reached
        if (retryCount >= MAX_RETRIES - 1) {
          toast({
            title: 'Error',
            description: `Multiple attempts to load your profile have failed. Please refresh the page or contact support.`,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [userId, retryCount, toast, userUniversity, userUniversityId, MAX_RETRIES]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      // Reset retry count when userId changes
      setRetryCount(0);
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

  // Manual reset function for users to retry
  const retryFetchProfile = () => {
    setRetryCount(0); // Reset the counter
    fetchUserProfile(); // Try again
  };

  return {
    userUniversity,
    userUniversityId,
    isLoadingProfile,
    error,
    fetchUserProfile: retryFetchProfile, // Replace with the retry function
    updateUserUniversity
  };
};
