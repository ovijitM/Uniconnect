
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEventDeletion = (onSuccess: () => void) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteEvent = async (eventId: string) => {
    try {
      setIsDeleting(true);
      
      // First, remove all participants
      const { error: participantsError } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId);
      
      if (participantsError) throw participantsError;
      
      // Then delete the event
      const { error: eventError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (eventError) throw eventError;
      
      // Call the success callback to refresh the UI
      onSuccess();
      
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteEvent
  };
};
