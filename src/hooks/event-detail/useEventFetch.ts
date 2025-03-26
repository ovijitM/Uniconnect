
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatEventData } from './utils';
import { Event } from '@/types';

export const useEventFetch = (eventId: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEventData() {
      if (!eventId) {
        console.error("No eventId provided");
        setIsLoading(false);
        setError(new Error("No event ID provided"));
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching event with ID:", eventId);

        // Query the events table to get basic event info
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*, event_participants(count)')
          .eq('id', eventId)
          .maybeSingle(); // Use maybeSingle instead of single to handle null results better

        if (eventError) {
          console.error("Error fetching event:", eventError);
          setError(eventError);
          throw eventError;
        }

        if (!eventData) {
          console.error("Event not found for ID:", eventId);
          setError(new Error('Event not found'));
          throw new Error('Event not found');
        }

        console.log("Event data received:", eventData);

        // Get the club associated with this event
        let clubData = null;
        if (eventData.club_id) {
          const { data: club, error: clubError } = await supabase
            .from('clubs')
            .select('*, club_members(count)')
            .eq('id', eventData.club_id)
            .maybeSingle();

          if (clubError && clubError.code !== 'PGRST116') {
            console.error("Error fetching club data:", clubError);
          } else if (club) {
            console.log("Club data received:", club);
            clubData = club;
          }
        }

        // Get collaborating clubs for this event
        const { data: collaborationData, error: collaborationError } = await supabase
          .from('event_collaborators')
          .select(`
            club_id,
            clubs (
              id,
              name,
              description,
              logo_url,
              category,
              university,
              club_members(count)
            )
          `)
          .eq('event_id', eventId);

        if (collaborationError) {
          console.error("Error fetching collaborators:", collaborationError);
        } else {
          console.log(`Found ${collaborationData?.length || 0} collaborating clubs`);
        }

        // Format event data with club and collaborators
        const formattedEvent = formatEventData(eventData, clubData);

        // Add collaborators if present
        if (collaborationData && collaborationData.length > 0) {
          formattedEvent.collaborators = collaborationData.map(item => ({
            id: item.clubs.id,
            name: item.clubs.name,
            description: item.clubs.description || 'No description available',
            logoUrl: item.clubs.logo_url,
            category: item.clubs.category || 'General',
            university: item.clubs.university || 'Unknown University',
            memberCount: item.clubs.club_members?.[0]?.count || 0,
            events: []
          }));
        }

        console.log("Successfully formatted event:", formattedEvent.title);
        setEvent(formattedEvent);
      } catch (error) {
        console.error('Error in fetchEventData:', error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, [eventId]);

  return { event, isLoading, error };
};
