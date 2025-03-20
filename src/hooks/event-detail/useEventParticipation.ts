
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';

export const useEventParticipation = (
  eventId: string | undefined, 
  event: Event | null,
  setEvent: React.Dispatch<React.SetStateAction<Event | null>>
) => {
  const [isParticipating, setIsParticipating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if current user is a participant
  useEffect(() => {
    async function checkParticipation() {
      if (!user || !eventId) return;
      
      try {
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
      } catch (error) {
        console.error('Error checking participation status:', error);
      }
    }
    
    checkParticipation();
  }, [eventId, user]);

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
    isParticipating,
    handleParticipate
  };
};
