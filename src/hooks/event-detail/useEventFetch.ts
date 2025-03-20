
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { formatEventData } from './utils';

export const useEventFetch = (eventId: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEventData() {
      if (!eventId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            date,
            location,
            image_url,
            category,
            status,
            max_participants,
            club_id,
            event_participants(count),
            event_type,
            tagline,
            registration_deadline,
            online_platform,
            eligibility,
            team_size,
            registration_link,
            entry_fee,
            theme,
            sub_tracks,
            prize_pool,
            prize_categories,
            additional_perks,
            judging_criteria,
            judges,
            schedule,
            deliverables,
            submission_platform,
            mentors,
            sponsors,
            contact_email,
            community_link,
            event_website,
            event_hashtag
          `)
          .eq('id', eventId)
          .single();
        
        if (eventError) throw eventError;
        
        // Fetch club details
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            club_members(count)
          `)
          .eq('id', eventData.club_id)
          .single();
        
        if (clubError) throw clubError;

        // Fetch collaborating clubs
        const { data: collaboratorsData, error: collaboratorsError } = await supabase
          .from('event_collaborators')
          .select(`
            club_id,
            club:club_id(
              id,
              name,
              description,
              logo_url,
              category,
              club_members(count)
            )
          `)
          .eq('event_id', eventId);
        
        if (collaboratorsError) throw collaboratorsError;
        
        // Format the event data using the utility function
        const formattedEvent = formatEventData(eventData, clubData);
        
        // Add collaborators to the event
        if (collaboratorsData && collaboratorsData.length > 0) {
          formattedEvent.collaborators = collaboratorsData.map(item => ({
            id: item.club.id,
            name: item.club.name,
            description: item.club.description,
            logoUrl: item.club.logo_url,
            category: item.club.category,
            memberCount: item.club.club_members[0]?.count || 0,
            events: []
          }));
        }
        
        setEvent(formattedEvent);
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast({
          title: 'Error fetching event',
          description: 'Failed to load event details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEventData();
  }, [eventId, toast]);

  return {
    event,
    setEvent,
    isLoading
  };
};
