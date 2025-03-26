
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
            visibility,
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
        
        // Fetch club details using explicit foreign key reference
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
          .single();
        
        if (clubError) throw clubError;

        // Fetch collaborating clubs using explicit foreign key reference 
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
        
        if (collaboratorsError) throw collaboratorsError;
        
        // Format the event data using the utility function
        const formattedEvent = formatEventData(eventData, clubData);
        
        // Add collaborators to the event
        if (collaboratorsData && collaboratorsData.length > 0) {
          formattedEvent.collaborators = collaboratorsData.map(item => {
            // Handle different possible formats of club_members count
            let memberCount = 0;
            
            // Type guard to handle various possible shapes of the count data
            if (Array.isArray(item.club.club_members)) {
              // If it's an array, it might contain an object with count property
              if (item.club.club_members.length > 0 && typeof item.club.club_members[0] === 'object') {
                memberCount = item.club.club_members[0]?.count || 0;
              } else {
                // If it's an array but not of objects, use the length
                memberCount = item.club.club_members.length;
              }
            } else if (typeof item.club.club_members === 'object') {
              // Direct object with count property
              memberCount = (item.club.club_members as any)?.count || 0;
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
