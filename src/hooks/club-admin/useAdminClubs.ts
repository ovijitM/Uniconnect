
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminClubs = (userId: string | undefined) => {
  const { toast } = useToast();
  const [adminClubs, setAdminClubs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminClubs = async () => {
    if (!userId) return [];
    
    try {
      // Fetch clubs where the current user is an admin
      const { data: clubAdminData, error: clubAdminError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);

      if (clubAdminError) throw clubAdminError;

      // If user is not an admin of any clubs, return empty array
      if (clubAdminData.length === 0) {
        setAdminClubs([]);
        return [];
      }

      const clubIds = clubAdminData.map(ca => ca.club_id);
      
      // Fetch clubs data
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*')
        .in('id', clubIds);
      
      if (clubsError) throw clubsError;
      
      setAdminClubs(clubsData);
      return clubsData;
    } catch (error) {
      console.error('Error fetching club admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load clubs data. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    adminClubs,
    fetchAdminClubs,
    isLoading,
    setIsLoading
  };
};
