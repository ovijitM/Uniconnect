
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminClubs = (userId: string | undefined) => {
  const { toast } = useToast();
  const [adminClubs, setAdminClubs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminClubs = async () => {
    if (!userId) {
      setIsLoading(false);
      return [];
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching admin clubs for user ID:", userId);
      
      // Fetch clubs where the current user is an admin
      const { data: clubAdminData, error: clubAdminError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);

      if (clubAdminError) {
        console.error("Error fetching club admin data:", clubAdminError);
        throw clubAdminError;
      }

      console.log("Club admin relationships found:", clubAdminData?.length || 0);

      // If user is not an admin of any clubs, return empty array
      if (!clubAdminData || clubAdminData.length === 0) {
        console.log("User is not an admin of any clubs");
        setAdminClubs([]);
        setIsLoading(false);
        return [];
      }

      const clubIds = clubAdminData.map(ca => ca.club_id);
      console.log("Club IDs to fetch:", clubIds);
      
      // Fetch clubs data
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*')
        .in('id', clubIds);
      
      if (clubsError) {
        console.error("Error fetching clubs data:", clubsError);
        throw clubsError;
      }
      
      console.log("Clubs data fetched:", clubsData?.length || 0);
      setAdminClubs(clubsData || []);
      setIsLoading(false);
      return clubsData || [];
    } catch (error: any) {
      console.error('Error fetching club admin data:', error);
      setError(error.message);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load clubs data. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchAdminClubs();
    }
  }, [userId]);

  return {
    adminClubs,
    fetchAdminClubs,
    isLoading,
    setIsLoading,
    error
  };
};
