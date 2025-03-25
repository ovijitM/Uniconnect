
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStudentProfile = (userId: string | undefined) => {
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = async () => {
    if (!userId) return;
    
    setIsLoadingProfile(true);
    try {
      // Get the user's university
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('university')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      if (profileData?.university) {
        setUserUniversity(profileData.university);
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
    }
  };

  const updateUserUniversity = async (university: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ university })
        .eq('id', userId);
      
      if (error) throw error;
      
      setUserUniversity(university);
      
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
    isLoadingProfile,
    fetchUserProfile,
    updateUserUniversity
  };
};
