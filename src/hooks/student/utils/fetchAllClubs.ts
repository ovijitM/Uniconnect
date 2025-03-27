
import { supabase } from '@/integrations/supabase/client';
import { Club } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const fetchAllClubs = async (
  userId: string | undefined,
  userUniversity: string | null | undefined,
  toast: ReturnType<typeof useToast>['toast']
): Promise<Club[]> => {
  if (!userId) return [];
  
  try {
    console.log('Fetching clubs for user:', userId);
    
    // Fetch all available clubs
    let clubsQuery = supabase
      .from('clubs')
      .select('*')
      .eq('status', 'approved');
    
    // Filter by university if provided
    if (userUniversity) {
      clubsQuery = clubsQuery.or(`university.eq.${userUniversity},university.is.null`);
    }
    
    const { data: allClubs, error: allClubsError } = await clubsQuery;
    
    if (allClubsError) throw allClubsError;
    return allClubs || [];
  } catch (error) {
    console.error('Error fetching club data:', error);
    toast({
      title: 'Error',
      description: 'Failed to load club data',
      variant: 'destructive',
    });
    return [];
  }
};
