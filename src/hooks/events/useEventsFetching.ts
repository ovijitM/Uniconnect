
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';

export const fetchEvents = async (userUniversity: string | null | undefined): Promise<Event[]> => {
  try {
    console.log("Fetching events, user university:", userUniversity);
    
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
      `);
      
    // Apply visibility filtering based on user's university
    if (userUniversity) {
      console.log("Filtering events by university:", userUniversity);
      
      // Using proper OR syntax for Supabase
      eventsQuery = eventsQuery.or(`visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq.${userUniversity})`);
    } else {
      console.log("No university, fetching public events only");
      eventsQuery = eventsQuery.eq('visibility', 'public');
    }
    
    const { data, error } = await eventsQuery.order('date', { ascending: true });
    
    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
    
    // Transform the data to match the Event type
    return (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      imageUrl: event.image_url || '/placeholder.svg',
      organizer: {
        id: event.club_id,
        name: event.clubs?.name || 'Unknown Organizer',
        university: event.clubs?.university || 'Unknown University'
      },
      category: event.category || 'General',
      status: event.status || 'upcoming',
      participants: event.participants_count || 0,
      maxParticipants: event.max_participants,
      visibility: event.visibility || 'public',
      eventType: event.event_type || 'in-person',
      tagline: event.tagline
    }));
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    throw error;
  }
};
