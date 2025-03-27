
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EventParticipant {
  event_id: string;
}

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

export const fetchUpcomingEvents = async (userUniversity: string | null | undefined): Promise<any[]> => {
  // Start with the basic query
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
  if (userUniversity) {
    console.log("Filtering events by university:", userUniversity);
    
    // Fixed OR syntax for Supabase
    eventsQuery = eventsQuery.or(`visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq.${userUniversity})`);
  } else {
    console.log("No university, fetching public events only");
    eventsQuery = eventsQuery.eq('visibility', 'public');
  }
  
  const { data, error } = await eventsQuery.order('date', { ascending: true });
  
  if (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
  
  return data || [];
};
