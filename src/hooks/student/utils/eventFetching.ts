
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createVisibilityFilter } from '@/hooks/utils/dataFetching';

export interface EventParticipant {
  event_id: string;
}

/**
 * Fetches events a user has registered for
 */
export const fetchRegisteredEventIds = async (userId: string): Promise<string[]> => {
  if (!userId) {
    console.log("Cannot fetch registered event IDs: No user ID");
    return [];
  }
  
  const { data, error } = await supabase
    .from('event_participants')
    .select('event_id')
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error fetching event participants:", error);
    throw error;
  }
  
  return data?.map(item => item.event_id) || [];
};

/**
 * Fetches complete event details for a list of event IDs
 */
export const fetchRegisteredEvents = async (eventIds: string[]): Promise<any[]> => {
  if (!eventIds.length) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      clubs:clubs!events_club_id_fkey (
        id,
        name,
        university
      )
    `)
    .in('id', eventIds)
    .order('date', { ascending: true });
  
  if (error) {
    console.error("Error fetching registered events:", error);
    throw error;
  }
  
  return data || [];
};

/**
 * Fetches upcoming events with proper visibility filtering
 */
export const fetchUpcomingEvents = async (userUniversity: string | null | undefined): Promise<any[]> => {
  // Create the base query for upcoming events
  let eventsQuery = supabase
    .from('events')
    .select(`
      *,
      clubs:clubs!events_club_id_fkey (
        id,
        name,
        university
      )
    `)
    .eq('status', 'upcoming');
    
  // Apply visibility filtering based on user's university
  const visibilityFilter = createVisibilityFilter(userUniversity);
  
  if (visibilityFilter.type === 'or') {
    console.log("Filtering events by university:", userUniversity);
    eventsQuery = eventsQuery.or(visibilityFilter.filter);
  } else {
    console.log("No university, fetching public events only");
    eventsQuery = eventsQuery.eq('visibility', visibilityFilter.filter);
  }
  
  const { data, error } = await eventsQuery.order('date', { ascending: true });
  
  if (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
  
  return data || [];
};
