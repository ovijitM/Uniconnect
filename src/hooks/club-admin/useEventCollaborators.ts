
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Club } from '@/types';

export const useEventCollaborators = (eventId?: string, onSuccess?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addCollaborator = async (clubId: string) => {
    if (!eventId) return false;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('event_collaborators')
        .insert([{ event_id: eventId, club_id: clubId }]);
      
      if (error) throw error;
      
      toast({
        title: 'Collaborator Added',
        description: 'Club has been added as a collaborator for this event.',
        variant: 'default',
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error: any) {
      console.error('Error adding event collaborator:', error);
      
      // Check for unique constraint violation
      if (error.code === '23505') {
        toast({
          title: 'Already a Collaborator',
          description: 'This club is already a collaborator for this event.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add collaborator. Please try again.',
          variant: 'destructive',
        });
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeCollaborator = async (clubId: string) => {
    if (!eventId) return false;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('event_collaborators')
        .delete()
        .eq('event_id', eventId)
        .eq('club_id', clubId);
      
      if (error) throw error;
      
      toast({
        title: 'Collaborator Removed',
        description: 'Club has been removed as a collaborator from this event.',
        variant: 'default',
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Error removing event collaborator:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove collaborator. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    addCollaborator,
    removeCollaborator
  };
};
