
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';
import { createVisibilityFilter } from '@/hooks/utils/dataFetching';

/**
 * Optimized events fetching function with proper typing and error handling
 */
export const fetchEvents = async (userUniversity: string | null | undefined): Promise<Event[]> => {
  try {
    console.log("Fetching events, user university:", userUniversity);
    
    let events: any[] = [];
    
    // Handle public events and university-specific events separately to avoid SQL parsing issues
    if (userUniversity) {
      // Fetch public events
      const { data: publicEvents, error: publicError } = await supabase
        .from('events')
        .select(`
          *,
          clubs:clubs!events_club_id_fkey (
            id,
            name,
            university
          )
        `)
        .eq('visibility', 'public')
        .order('date', { ascending: true });
      
      if (publicError) {
        console.error("Error fetching public events:", publicError);
        throw publicError;
      }
      
      // Fetch university-specific events
      const { data: universityEvents, error: uniError } = await supabase
        .from('events')
        .select(`
          *,
          clubs:clubs!events_club_id_fkey (
            id,
            name,
            university
          )
        `)
        .eq('visibility', 'university_only')
        .eq('clubs.university', userUniversity)
        .order('date', { ascending: true });
      
      if (uniError) {
        console.error("Error fetching university events:", uniError);
        // Continue with just public events
      }
      
      // Combine the results
      events = [
        ...(publicEvents || []),
        ...(universityEvents || [])
      ];
      
    } else {
      // No university, fetch only public events
      const { data: publicEvents, error: publicError } = await supabase
        .from('events')
        .select(`
          *,
          clubs:clubs!events_club_id_fkey (
            id,
            name,
            university
          )
        `)
        .eq('visibility', 'public')
        .order('date', { ascending: true });
      
      if (publicError) {
        console.error("Error fetching public events:", publicError);
        throw publicError;
      }
      
      events = publicEvents || [];
    }
    
    console.log("Number of events fetched:", events.length);
    
    if (events.length === 0) {
      console.log("No events found in the database");
      return [];
    }

    // Transform the data to match the Event type - using map for better performance
    const transformedEvents = events.map(event => ({
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

/**
 * Custom hook for event fetching with state management and performance optimizations
 */
export const useEventsFetching = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchEventsForUniversity = useCallback(async (userUniversity: string | null | undefined) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const eventsData = await fetchEvents(userUniversity);
      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    events,
    isLoading,
    error,
    fetchEventsForUniversity
  };
};
