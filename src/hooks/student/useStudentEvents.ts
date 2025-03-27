
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StudentEventsState } from './types/studentEventTypes';
import { 
  fetchRegisteredEventIds, 
  fetchRegisteredEvents, 
  fetchUpcomingEvents 
} from './utils/eventFetching';
import { 
  registerUserForEvent, 
  unregisterUserFromEvent 
} from './utils/eventRegistration';

export const useStudentEvents = (userId: string | undefined, onSuccess?: () => void) => {
  const [state, setState] = useState<StudentEventsState>({
    isLoadingEvents: false,
    events: [],
    registeredEvents: [],
    registeredEventIds: [],
    error: null
  });
  const { toast } = useToast();

  const fetchEvents = async (userUniversity?: string | null) => {
    if (!userId) {
      console.log("Cannot fetch events: No user ID provided");
      return;
    }
    
    setState(prev => ({ ...prev, isLoadingEvents: true, error: null }));
    
    try {
      console.log("Fetching events for user:", userId);
      
      // First fetch events the student has registered for
      const eventIds = await fetchRegisteredEventIds(userId);
      console.log(`Found ${eventIds.length} registered events`);
      
      // Fetch detailed event information for registered events
      let registeredEventsData: any[] = [];
      if (eventIds.length > 0) {
        registeredEventsData = await fetchRegisteredEvents(eventIds);
        console.log(`Successfully loaded ${registeredEventsData.length} registered events`);
      } else {
        console.log("No registered events found");
      }
      
      // Fetch upcoming events visible to the student
      const upcomingEvents = await fetchUpcomingEvents(userUniversity);
      console.log(`Successfully loaded ${upcomingEvents.length} upcoming events`);
      
      setState(prev => ({
        ...prev,
        events: upcomingEvents,
        registeredEvents: registeredEventsData,
        registeredEventIds: eventIds,
        isLoadingEvents: false,
        error: null
      }));
      
    } catch (error: any) {
      console.error('Error fetching student events:', error);
      setState(prev => ({
        ...prev, 
        isLoadingEvents: false,
        error: error.message || 'Failed to load event data'
      }));
      toast({
        title: 'Error',
        description: 'Failed to load event data',
        variant: 'destructive',
      });
    }
  };

  const registerForEvent = async (eventId: string) => {
    try {
      await registerUserForEvent(userId!, eventId, toast, { onSuccess });
      
      // Update local state for immediate UI feedback
      const event = state.events.find(e => e.id === eventId);
      if (event) {
        setState(prev => ({
          ...prev,
          registeredEvents: [...prev.registeredEvents, event],
          registeredEventIds: [...prev.registeredEventIds, eventId]
        }));
      }
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
    try {
      await unregisterUserFromEvent(userId, eventId, toast, { onSuccess });
      
      // Update local state for immediate UI feedback
      setState(prev => ({
        ...prev,
        registeredEvents: prev.registeredEvents.filter(event => event.id !== eventId),
        registeredEventIds: prev.registeredEventIds.filter(id => id !== eventId)
      }));
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
    events: state.events,
    registeredEvents: state.registeredEvents,
    registeredEventIds: state.registeredEventIds,
    isLoadingEvents: state.isLoadingEvents,
    error: state.error,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent
  };
};
