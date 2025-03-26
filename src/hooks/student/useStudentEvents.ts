
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStudentEvents = (userId: string | undefined, onSuccess?: () => void) => {
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchEvents = async (userUniversity?: string | null) => {
    if (!userId) return;
    
    setIsLoadingEvents(true);
    try {
      // Fetch events the student has registered for
      const { data: participationData, error: participationError } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', userId);
      
      if (participationError) throw participationError;
      
      const eventIds = participationData?.map(item => item.event_id) || [];
      
      // Fetch detailed event information
      let { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          clubs:clubs!events_club_id_fkey (
            id,
            name,
            university
          )
        `)
        .in('id', eventIds.length ? eventIds : ['00000000-0000-0000-0000-000000000000']) // Use a dummy ID if no events
        .order('date', { ascending: true });
      
      if (eventsError) throw eventsError;
      setRegisteredEvents(eventsData || []);
      
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
        // Fixed OR clause for visibility and university filtering
        upcomingEventsQuery = upcomingEventsQuery.or(
          `visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq."${userUniversity}")`
        );
      } else {
        upcomingEventsQuery = upcomingEventsQuery.eq('visibility', 'public');
      }
      
      // Complete the query with ordering
      const { data: upcomingEvents, error: upcomingEventsError } = await upcomingEventsQuery
        .order('date', { ascending: true });
      
      if (upcomingEventsError) throw upcomingEventsError;
      setEvents(upcomingEvents || []);
    } catch (error) {
      console.error('Error fetching student events:', error);
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
    if (!userId) return;
    
    try {
      // Check if already registered
      const { data: existing, error: checkError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existing) {
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
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Successfully registered for the event',
        variant: 'default',
      });
      
      // Update the local state
      const event = events.find(e => e.id === eventId);
      if (event) {
        setRegisteredEvents(prev => [...prev, event]);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: 'Error',
        description: 'Failed to register for event',
        variant: 'destructive',
      });
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'You have unregistered from the event',
        variant: 'default',
      });
      
      // Update the local state
      setRegisteredEvents(prev => prev.filter(event => event.id !== eventId));
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast({
        title: 'Error',
        description: 'Failed to unregister from event',
        variant: 'destructive',
      });
    }
  };

  return {
    events,
    registeredEvents,
    isLoadingEvents,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent
  };
};
