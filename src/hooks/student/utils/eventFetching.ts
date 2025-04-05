
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
    
    // Use a cleaner approach to join tables
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        club:club_id(
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
 * Fixed to handle university names with special characters properly
 */
export const fetchUpcomingEvents = async (userUniversity?: string | null): Promise<any[]> => {
  try {
    console.log(`Starting to fetch upcoming events. User university: ${userUniversity || 'none'}`);
    
    // Base query to fetch upcoming events with proper relationship naming
    let query = supabase
      .from('events')
      .select(`
        *,
        club:club_id(
          id,
          name,
          university,
          logo_url
        )
      `)
      .gt('date', new Date().toISOString())
      .order('date', { ascending: true });
    
    // Apply filter based on university
    if (userUniversity) {
      console.log(`Filtering events with university: ${userUniversity}`);
      
      // Use separate queries with match instead of complex OR conditions to avoid SQL parsing issues
      const publicEvents = supabase
        .from('events')
        .select(`
          *,
          club:club_id(
            id,
            name,
            university,
            logo_url
          )
        `)
        .eq('visibility', 'public')
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true });
        
      const universityEvents = supabase
        .from('events')
        .select(`
          *,
          club:club_id(
            id,
            name,
            university,
            logo_url
          )
        `)
        .eq('visibility', 'university_only')
        .eq('club.university', userUniversity)
        .gt('date', new Date().toISOString())
        .order('date', { ascending: true });
      
      // Fetch both sets of events
      const [publicResult, universityResult] = await Promise.all([
        publicEvents,
        universityEvents
      ]);
      
      if (publicResult.error) {
        console.error('Error fetching public events:', publicResult.error);
        throw publicResult.error;
      }
      
      if (universityResult.error) {
        console.error('Error fetching university events:', universityResult.error);
        // Continue with just the public events if university events fail
      }
      
      // Combine the results
      const combinedEvents = [
        ...(publicResult.data || []),
        ...(universityResult.data || [])
      ];
      
      console.log(`Successfully loaded ${combinedEvents.length} upcoming events`);
      
      return combinedEvents;
    } else {
      // If no university, only fetch public events
      console.log("No university provided, fetching only public events");
      query = query.eq('visibility', 'public');
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error in fetchUpcomingEvents query:', error);
        throw error;
      }
      
      console.log(`Successfully loaded ${data?.length || 0} upcoming events`);
      
      return data || [];
    }
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};
