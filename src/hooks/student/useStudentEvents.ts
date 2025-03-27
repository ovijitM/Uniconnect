
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStudentEvents = (userId: string | undefined, onSuccess?: () => void) => {
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async (userUniversity?: string | null) => {
    if (!userId) {
      console.log("Cannot fetch events: No user ID provided");
      return;
    }
    
    setIsLoadingEvents(true);
    setError(null);
    
    try {
      console.log("Fetching events for user:", userId);
      
      // First fetch events the student has registered for
      const { data: participationData, error: participationError } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', userId);
      
      if (participationError) {
        console.error("Error fetching event participants:", participationError);
        throw participationError;
      }
      
      const eventIds = participationData?.map(item => item.event_id) || [];
      console.log(`Found ${eventIds.length} registered events`);
      setRegisteredEventIds(eventIds);
      
      // Fetch detailed event information for registered events
      if (eventIds.length > 0) {
        const { data: eventsData, error: eventsError } = await supabase
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
        
        if (eventsError) {
          console.error("Error fetching registered events:", eventsError);
          throw eventsError;
        }
        
        console.log(`Successfully loaded ${eventsData?.length || 0} registered events`);
        setRegisteredEvents(eventsData || []);
      } else {
        console.log("No registered events found");
        setRegisteredEvents([]);
      }
      
      // Fetch upcoming events visible to the student
      let upcomingEventsQuery = supabase
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
        // Fixed OR clause syntax
        upcomingEventsQuery = upcomingEventsQuery.or(`visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq.${JSON.stringify(userUniversity)})`);
      } else {
        console.log("No university, fetching public events only");
        upcomingEventsQuery = upcomingEventsQuery.eq('visibility', 'public');
      }
      
      // Complete the query with ordering
      const { data: upcomingEvents, error: upcomingEventsError } = await upcomingEventsQuery
        .order('date', { ascending: true });
      
      if (upcomingEventsError) {
        console.error("Error fetching upcoming events:", upcomingEventsError);
        throw upcomingEventsError;
      }
      
      console.log(`Successfully loaded ${upcomingEvents?.length || 0} upcoming events`);
      setEvents(upcomingEvents || []);
      setError(null);
      
    } catch (error: any) {
      console.error('Error fetching student events:', error);
      setError(error.message || 'Failed to load event data');
      toast({
        title: 'Error',
        description: 'Failed to load event data',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to register for events',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log("Attempting to register for event:", eventId);
      
      // Check if already registered
      const { data: existing, error: checkError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking registration:", checkError);
        throw checkError;
      }
      
      if (existing) {
        console.log("Already registered for this event");
        toast({
          title: 'Already registered',
          description: 'You are already registered for this event',
          variant: 'default',
        });
        return;
      }
      
      // Register for the event
      const { error } = await supabase
        .from('event_participants')
        .insert({
          user_id: userId,
          event_id: eventId
        });
      
      if (error) {
        console.error("Error registering for event:", error);
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Successfully registered for the event',
        variant: 'default',
      });
      
      // Update the local state
      const event = events.find(e => e.id === eventId);
      if (event) {
        setRegisteredEvents(prev => [...prev, event]);
        setRegisteredEventIds(prev => [...prev, eventId]);
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to register for event',
        variant: 'destructive',
      });
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!userId) return;
    
    try {
      console.log("Attempting to unregister from event:", eventId);
      
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);
      
      if (error) {
        console.error("Error unregistering from event:", error);
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'You have unregistered from the event',
        variant: 'default',
      });
      
      // Update the local state
      setRegisteredEvents(prev => prev.filter(event => event.id !== eventId));
      setRegisteredEventIds(prev => prev.filter(id => id !== eventId));
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error unregistering from event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to unregister from event',
        variant: 'destructive',
      });
    }
  };

  return {
    events,
    registeredEvents,
    registeredEventIds,
    isLoadingEvents,
    error,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent
  };
};
