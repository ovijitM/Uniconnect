
import { supabase } from '@/integrations/supabase/client';
import { Club } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { transformClubData } from '@/components/club-detail/hooks/transformers/clubTransformer';

/**
 * Fetches clubs the user has joined with improved error handling and logging
 */
export const fetchJoinedClubs = async (
  userId: string | undefined,
  toast: ReturnType<typeof useToast>['toast']
): Promise<{ joinedClubs: Club[], joinedClubIds: string[] }> => {
  if (!userId) return { joinedClubs: [], joinedClubIds: [] };
  
  try {
    console.log("Fetching joined clubs for user:", userId);
    
    // Fetch clubs the student has joined with better error handling
    const { data: membershipData, error: membershipError } = await supabase
      .from('club_members')
      .select('club_id')
      .eq('user_id', userId);

    if (membershipError) {
      console.error('Supabase error fetching memberships:', membershipError);
      throw new Error(`Failed to fetch memberships: ${membershipError.message}`);
    }
    
    if (!membershipData || membershipData.length === 0) {
      console.log('No club memberships found for user:', userId);
      return { joinedClubs: [], joinedClubIds: [] };
    }
    
    // Force club IDs to be strings and log for debugging
    const clubIds = membershipData.map(item => String(item.club_id));
    console.log('Joined club IDs:', clubIds);
    
    // Fetch detailed club information for joined clubs if we have IDs
    if (clubIds.length === 0) {
      return { joinedClubs: [], joinedClubIds: [] };
    }
    
    const { data: joinedClubsData, error: joinedClubsError } = await supabase
      .from('clubs')
      .select('*')
      .in('id', clubIds);
      
    if (joinedClubsError) {
      console.error('Supabase error fetching joined clubs:', joinedClubsError);
      throw new Error(`Failed to fetch joined clubs: ${joinedClubsError.message}`);
    }
    
    console.log('Joined clubs data:', joinedClubsData?.length || 0, 'clubs found');
    
    // Transform raw club data to match the Club type
    const transformedClubs = (joinedClubsData || []).map(club => 
      transformClubData({
        ...club,
        logo_url: club.logo_url,
        club_members: [{ count: 0 }] // Default to 0 members, we'll fetch actual counts separately if needed
      })
    );
    
    return {
      joinedClubs: transformedClubs,
      joinedClubIds: clubIds
    };
  } catch (error: any) {
    console.error('Error fetching joined clubs:', error);
    throw error; // Re-throw to allow the calling function to handle it
  }
};
