
import { supabase } from '@/integrations/supabase/client';
import { Club } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { transformClubData } from '@/components/club-detail/hooks/transformers/clubTransformer';

/**
 * Fetches all clubs available to the student with proper filtering and error handling
 */
export const fetchAllClubs = async (
  userId: string | undefined,
  userUniversity: string | null | undefined,
  toast: ReturnType<typeof useToast>['toast']
): Promise<Club[]> => {
  try {
    console.log("Fetching all clubs, user university:", userUniversity);
    
    // Fetch all approved clubs
    const { data, error } = await supabase
      .from('clubs')
      .select(`
        *,
        club_members(count)
      `)
      .eq('status', 'approved'); // Only approved clubs
    
    if (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} total clubs`);
    
    // Transform club data
    const transformedClubs = await Promise.all(
      (data || []).map(async (club) => {
        try {
          return transformClubData(club);
        } catch (error) {
          console.error('Error transforming club data:', error, 'for club:', club);
          return null;
        }
      })
    );
    
    // Filter out any null values from failed transformations
    const validClubs = transformedClubs.filter(club => club !== null) as Club[];
    console.log(`Successfully transformed ${validClubs.length} clubs`);
    
    return validClubs;
  } catch (error: any) {
    console.error('Error in fetchAllClubs:', error);
    toast({
      title: 'Error',
      description: 'Failed to load clubs. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
};
