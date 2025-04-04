
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetches IDs of events the user has registered for
 */
export const fetchRegisteredEventIds = async (userId: string): Promise<string[]> => {
  try {
    if (!userId) return [];
    
    console.log(`Fetching registered events for user: ${userId}`);
    
    const { data, error } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const eventIds = data.map(item => item.event_id);
    console.log(`Found ${eventIds.length} registered events`);
    
    return eventIds;
  } catch (error: any) {
    console.error('Error fetching registered event IDs:', error);
    return [];
  }
};

/**
 * Fetches detailed information about specific events
 */
export const fetchRegisteredEvents = async (eventIds: string[]): Promise<any[]> => {
  try {
    if (eventIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        clubs (
          id,
          name,
          university,
          logo_url
        )
      `)
      .in('id', eventIds);
    
    if (error) throw error;
    
    console.log(`Successfully loaded ${data?.length || 0} registered events`);
    
    return data || [];
  } catch (error) {
    console.error('Error fetching registered events:', error);
    return [];
  }
};

/**
 * Fetches upcoming events visible to the student
 * Fixed the SQL query syntax for university filtering
 */
export const fetchUpcomingEvents = async (userUniversity?: string | null): Promise<any[]> => {
  try {
    // Base query to fetch upcoming events
    let query = supabase
      .from('events')
      .select(`
        *,
        clubs (
          id,
          name,
          university,
          logo_url
        )
      `)
      .gt('date', new Date().toISOString())
      .order('date', { ascending: true });
    
    // Filter logic based on university
    if (userUniversity) {
      console.log(`Filtering events by university: ${userUniversity}`);
      
      // This is the fix: use proper OR/AND logic instead of the problematic syntax
      query = query.or(`visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq.${userUniversity})`);
    } else {
      console.log("No university, fetching public events only");
      query = query.eq('visibility', 'public');
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
    
    console.log(`Successfully loaded ${data?.length || 0} upcoming events`);
    
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};
