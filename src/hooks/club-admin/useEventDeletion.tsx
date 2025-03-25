
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const useEventDeletion = (onSuccess: () => void) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const openDeleteConfirmation = (eventId: string) => {
    setEventToDelete(eventId);
    setIsConfirmDialogOpen(true);
  };

  const cancelDelete = () => {
    setEventToDelete(null);
    setIsConfirmDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    const success = await performDeletion(eventToDelete);
    
    if (success) {
      setIsConfirmDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const performDeletion = async (eventId: string) => {
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
      
      toast({
        title: 'Event deleted',
        description: 'The event has been successfully removed.',
      });
      
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

  const DeleteConfirmationDialog = () => (
    <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event and remove all participant data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? 'Deleting...' : 'Delete Event'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    isDeleting,
    openDeleteConfirmation,
    DeleteConfirmationDialog
  };
};
