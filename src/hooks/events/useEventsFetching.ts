
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
    
    // Apply visibility filters correctly with proper Supabase filter syntax
    if (userUniversity) {
      console.log("Filtering events by university:", userUniversity);
      // Use proper Supabase filter syntax
      eventsQuery = eventsQuery.or(`visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq."${userUniversity}")`);
    } else {
      console.log("No university, fetching public events only");
      eventsQuery = eventsQuery.eq('visibility', 'public');
    }
    
    const { data, error } = await eventsQuery.order('date', { ascending: true });
    
    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }

    console.log("Raw events data from database:", data);
    console.log("Number of events fetched:", data ? data.length : 0);
    
    if (!data || data.length === 0) {
      console.log("No events found in the database");
      return [];
    }
    
    // Transform the data to match the Event type
    const transformedEvents = (data || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      imageUrl: event.image_url || '/placeholder.svg',
      organizer: {
        id: event.club_id,
        name: event.clubs?.name || 'Unknown Organizer',
        university: event.clubs?.university || 'Unknown University',
        description: '', // Required by Event type
        logoUrl: '', // Required by Event type
        category: '', // Required by Event type
        memberCount: 0, // Required by Event type
        events: [] // Required by Event type
      },
      category: event.category || 'General',
      status: (event.status as 'upcoming' | 'ongoing' | 'past') || 'upcoming',
      participants: 0, // Default since it doesn't exist in database
      maxParticipants: event.max_participants,
      visibility: (event.visibility as 'public' | 'university_only') || 'public',
      eventType: event.event_type || 'in-person',
      tagline: event.tagline
    }));
    
    console.log("Transformed events:", transformedEvents);
    return transformedEvents;
  } catch (error) {
    console.error('Error in fetchEvents:', error);
    throw error;
  }
};
