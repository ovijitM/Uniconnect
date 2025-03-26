
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStudentProfile = (userId: string | undefined) => {
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const [userUniversityId, setUserUniversityId] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3); // Maximum retry attempts
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    
    // Don't attempt if we've already hit the retry limit
    if (retryCount >= maxRetries) {
      if (!userUniversity && !userUniversityId) {
        toast({
          title: 'Error',
          description: `Failed to load profile after ${maxRetries} attempts. Please try again later.`,
          variant: 'destructive',
        });
      }
      return;
    }
    
    setIsLoadingProfile(true);
    setError(null);
    
    try {
      console.log(`Fetching profile for user ${userId} (attempt ${retryCount + 1}/${maxRetries})`);
      
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
      } else {
        console.warn('No profile data found for user:', userId);
      }
    } catch (error: any) {
      console.error('Error in fetchUserProfile:', error);
      setError(error.message || 'Failed to load profile data');
      
      // Show toast only on first and last attempt
      if (retryCount === 0 || retryCount === maxRetries - 1) {
        toast({
          title: 'Error',
          description: retryCount === maxRetries - 1 
            ? 'Last attempt to load profile data...' 
            : 'Failed to load profile data. Retrying...',
          variant: 'destructive',
        });
      }
      
      // Only retry if we haven't hit the limit yet
      if (retryCount < maxRetries - 1) {
        // Automatically retry after a delay, with increasing backoff
        const retryDelay = Math.min(1000 * (retryCount + 1), 5000);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [userId, retryCount, toast, maxRetries, userUniversity, userUniversityId]);

  // Trigger retry when retryCount changes, but only if not at max retries
  useEffect(() => {
    if (retryCount > 0 && retryCount < maxRetries) {
      fetchUserProfile();
    } else if (retryCount >= maxRetries && !userUniversity) {
      toast({
        title: 'Error',
        description: `Multiple attempts to load your profile have failed. Please refresh the page or contact support.`,
        variant: 'destructive',
      });
    }
  }, [retryCount, fetchUserProfile, toast, maxRetries, userUniversity]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      // Reset retry count when userId changes
      setRetryCount(0);
      fetchUserProfile();
    }
  }, [userId]); // Removing fetchUserProfile from the dependency list to avoid recursive calls

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
