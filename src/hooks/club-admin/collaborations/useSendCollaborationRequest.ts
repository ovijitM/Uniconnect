
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSendCollaborationRequest = (clubId?: string, onSuccess?: () => void) => {
  const { toast } = useToast();

  const sendCollaborationRequest = async (requestedClubId: string) => {
    if (!clubId) return false;
    
    try {
      if (clubId === requestedClubId) {
        toast({
          title: 'Error',
          description: 'You cannot send a collaboration request to your own club.',
          variant: 'destructive',
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('club_collaborations')
        .insert([
          { requester_club_id: clubId, requested_club_id: requestedClubId }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Request Sent',
        description: 'Collaboration request has been sent successfully.',
        variant: 'default',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error('Error sending collaboration request:', error);
      
      // Check for unique constraint violation
      if (error.code === '23505') {
        toast({
          title: 'Request Already Exists',
          description: 'A collaboration request already exists with this club.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send collaboration request. Please try again.',
          variant: 'destructive',
        });
      }
      
      return false;
    }
  };

  return {
    sendCollaborationRequest
  };
};
