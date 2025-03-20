
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useEventDetail = (eventId: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
        
        // Check if current user is a participant
        if (user) {
          const { data: participationData, error: participationError } = await supabase
            .from('event_participants')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          setIsParticipating(!!participationData);
          
          if (participationError) {
            console.error('Error checking participation:', participationError);
          }
        }
        
        // Format the event data
        const formattedEvent: Event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
          imageUrl: eventData.image_url,
          category: eventData.category,
          status: eventData.status,
          participants: eventData.event_participants[0]?.count || 0,
          maxParticipants: eventData.max_participants || undefined,
          organizer: {
            id: clubData.id,
            name: clubData.name,
            description: clubData.description,
            logoUrl: clubData.logo_url,
            category: clubData.category,
            memberCount: clubData.club_members[0]?.count || 0,
            events: []
          },
          
          // New fields
          eventType: eventData.event_type,
          tagline: eventData.tagline,
          registrationDeadline: eventData.registration_deadline,
          onlinePlatform: eventData.online_platform,
          eligibility: eventData.eligibility,
          teamSize: eventData.team_size,
          registrationLink: eventData.registration_link,
          entryFee: eventData.entry_fee,
          theme: eventData.theme,
          subTracks: eventData.sub_tracks,
          prizePool: eventData.prize_pool,
          prizeCategories: eventData.prize_categories,
          additionalPerks: eventData.additional_perks,
          judgingCriteria: eventData.judging_criteria,
          judges: eventData.judges,
          schedule: eventData.schedule,
          deliverables: eventData.deliverables,
          submissionPlatform: eventData.submission_platform,
          mentors: eventData.mentors,
          sponsors: eventData.sponsors,
          contactEmail: eventData.contact_email,
          communityLink: eventData.community_link,
          eventWebsite: eventData.event_website,
          eventHashtag: eventData.event_hashtag
        };
        
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
  }, [eventId, toast, user]);

  const handleParticipate = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to join events",
          variant: "destructive",
        });
        return;
      }
      
      if (!eventId) return;
      
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id
        });
      
      if (error) throw error;
      
      setIsParticipating(true);
      setEvent(prev => prev ? { ...prev, participants: prev.participants + 1 } : null);
      
      toast({
        title: "Successfully registered!",
        description: `You've joined the ${event?.title}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: "Failed to register",
        description: "There was an error joining the event. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return {
    event,
    isLoading,
    isParticipating,
    handleParticipate
  };
};
