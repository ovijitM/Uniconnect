
import { supabase } from '@/integrations/supabase/client';
import { Club } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { transformClubData } from '@/components/club-detail/hooks/transformers/clubTransformer';

export const fetchAllClubs = async (
  userId: string | undefined,
  userUniversity: string | null | undefined,
  toast: ReturnType<typeof useToast>['toast']
): Promise<Club[]> => {
  if (!userId) return [];
  
  try {
    console.log('Fetching clubs for user:', userId, 'university:', userUniversity);
    
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
    
    if (allClubsError) {
      console.error('Supabase error fetching clubs:', allClubsError);
      throw new Error(`Failed to fetch clubs: ${allClubsError.message}`);
    }
    
    // Transform raw club data to match the Club type
    return (allClubs || []).map(club => 
      transformClubData({
        ...club,
        logo_url: club.logo_url,
        club_members: [0] // Default to 0 members, we'll fetch actual counts separately if needed
      })
    );
  } catch (error) {
    console.error('Error fetching club data:', error);
    // Don't show toast here - let the caller handle it for better UX
    throw error; // Re-throw to allow the calling function to handle it
  }
};
