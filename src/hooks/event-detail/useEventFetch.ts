
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
        console.log('Fetching event data for ID:', eventId);
        
        // Fetch event details with all fields
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
            visibility,
            max_participants,
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
            event_hashtag,
            club_id
          `)
          .eq('id', eventId)
          .maybeSingle();
        
        if (eventError) {
          console.error('Error fetching event data:', eventError);
          throw eventError;
        }
        
        if (!eventData) {
          console.log('No event data found for ID:', eventId);
          setEvent(null);
          setIsLoading(false);
          return;
        }
        
        console.log('Event data fetched:', eventData);
        
        // Fetch club details using club_id
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            university,
            club_members(count)
          `)
          .eq('id', eventData.club_id)
          .maybeSingle();
        
        if (clubError) {
          console.error('Error fetching club data:', clubError);
          throw clubError;
        }
        
        if (!clubData) {
          console.error('No club data found for club_id:', eventData.club_id);
          // We can still proceed with the event data but without club info
          const partialEvent = formatEventData(eventData, null);
          setEvent(partialEvent);
          setIsLoading(false);
          return;
        }

        // Fetch collaborating clubs
        const { data: collaboratorsData, error: collaboratorsError } = await supabase
          .from('event_collaborators')
          .select(`
            club_id,
            club:clubs!event_collaborators_club_id_fkey(
              id,
              name,
              description,
              logo_url,
              category,
              club_members(count)
            )
          `)
          .eq('event_id', eventId);
        
        if (collaboratorsError) {
          console.error('Error fetching collaborators:', collaboratorsError);
          // We can still proceed without collaborators
        }
        
        // Format the event data using the utility function
        const formattedEvent = formatEventData(eventData, clubData);
        
        // Add collaborators to the event if any
        if (collaboratorsData && collaboratorsData.length > 0) {
          formattedEvent.collaborators = collaboratorsData.map(item => {
            // Handle different possible formats of club_members count
            let memberCount = 0;
            
            if (item.club.club_members) {
              if (Array.isArray(item.club.club_members)) {
                if (item.club.club_members.length > 0) {
                  const countData = item.club.club_members[0];
                  if (typeof countData === 'object' && countData !== null) {
                    memberCount = countData.count || 0;
                  } else if (typeof countData === 'number') {
                    memberCount = countData;
                  }
                }
              } else if (typeof item.club.club_members === 'object') {
                memberCount = (item.club.club_members as any)?.count || 0;
              }
            }
              
            return {
              id: item.club.id,
              name: item.club.name,
              description: item.club.description,
              logoUrl: item.club.logo_url,
              category: item.club.category,
              memberCount: memberCount,
              events: []
            };
          });
        }
        
        setEvent(formattedEvent);
      } catch (error) {
        console.error('Error in fetchEventData:', error);
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
