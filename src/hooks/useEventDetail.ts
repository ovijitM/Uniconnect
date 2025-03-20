
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
            event_participants(count)
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
          }
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
