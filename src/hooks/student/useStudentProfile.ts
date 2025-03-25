
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStudentProfile = (userId: string | undefined) => {
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchUserProfile = async () => {
    if (!userId) return;
    
    setIsLoadingProfile(true);
    try {
      // Get the user's university
      const { data: profileData } = await supabase
        .from('profiles')
        .select('university')
        .eq('id', userId)
        .single();
        
      if (profileData?.university) {
        setUserUniversity(profileData.university);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  return {
    userUniversity,
    isLoadingProfile,
    fetchUserProfile
  };
};
