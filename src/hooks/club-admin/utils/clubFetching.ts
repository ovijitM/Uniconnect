
import { supabase } from '@/integrations/supabase/client';
import { Club } from '@/types';
import { memoize } from '@/hooks/utils/dataFetching';

/**
 * Fetches clubs administered by a specific user with efficient data loading
 */
export const fetchAdminClubs = async (userId: string): Promise<Club[]> => {
  if (!userId) {
    console.log('Cannot fetch admin clubs: No user ID');
    return [];
  }
  
  try {
    console.log('Fetching clubs administered by user:', userId);
    
    // Use a single JOIN query to get all admin clubs efficiently
    const { data: adminClubs, error: adminClubsError } = await supabase
      .from('club_admins')
      .select(`
        club_id,
        clubs:club_id (
          id,
          name,
          description,
          category,
          university,
          university_id,
          status,
          logo_url,
          tagline,
          created_at,
          updated_at,
          established_year,
          membership_fee,
          website,
          phone_number,
          executive_members_roles
        )
      `)
      .eq('user_id', userId);
      
    if (adminClubsError) {
      console.error('Error fetching admin clubs:', adminClubsError);
      throw adminClubsError;
    }
    
    if (!adminClubs || adminClubs.length === 0) {
      console.log('No admin clubs found for user:', userId);
      return [];
    }
    
    // Transform and filter the data
    const clubs = adminClubs
      .map(item => item.clubs)
      .filter(Boolean) as Club[];
    
    console.log(`Found ${clubs.length} club(s) administered by user`);
    
    return clubs;
  } catch (error) {
    console.error('Error in fetchAdminClubs:', error);
    throw error;
  }
};

// Apply memoization to prevent redundant network calls
export const fetchAdminClubsMemoized = memoize(fetchAdminClubs);

/**
 * Fetches club events with optimized query structure
 */
export const fetchClubEvents = async (clubIds: string[]): Promise<any[]> => {
  if (!clubIds.length) {
    return [];
  }
  
  try {
    // Batch fetch events for all clubs in a single query
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*, clubs:club_id (id, name)')
      .in('club_id', clubIds)
      .order('date', { ascending: false });
      
    if (eventsError) {
      console.error('Error fetching club events:', eventsError);
      throw eventsError;
    }
    
    return events || [];
  } catch (error) {
    console.error('Error in fetchClubEvents:', error);
    throw error;
  }
};

/**
 * Fetches aggregated event statistics for admin dashboard
 */
export const fetchEventStatistics = async (clubIds: string[]) => {
  if (!clubIds.length) {
    return {
      activeEventCount: 0,
      pastEventCount: 0,
      averageAttendance: 0
    };
  }

  try {
    // Count active events
    const { count: activeCount, error: activeError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .in('club_id', clubIds)
      .eq('status', 'upcoming');

    if (activeError) throw activeError;

    // Count past events
    const { count: pastCount, error: pastError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .in('club_id', clubIds)
      .eq('status', 'past');

    if (pastError) throw pastError;

    // Calculate average attendance (can be optimized with a custom DB function)
    const { data: participants, error: attendanceError } = await supabase
      .from('event_participants')
      .select('event_id')
      .in('event_id', function(query) {
        return query.from('events')
          .select('id')
          .in('club_id', clubIds);
      });

    if (attendanceError) throw attendanceError;

    const eventCounts = new Map();
    participants?.forEach(p => {
      const count = eventCounts.get(p.event_id) || 0;
      eventCounts.set(p.event_id, count + 1);
    });

    const totalEvents = eventCounts.size;
    const totalAttendance = Array.from(eventCounts.values()).reduce((sum, count) => sum + count, 0);
    const averageAttendance = totalEvents > 0 ? Math.round(totalAttendance / totalEvents) : 0;

    return {
      activeEventCount: activeCount || 0,
      pastEventCount: pastCount || 0,
      averageAttendance
    };

  } catch (error) {
    console.error('Error fetching event statistics:', error);
    return {
      activeEventCount: 0,
      pastEventCount: 0,
      averageAttendance: 0
    };
  }
};
