
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRespondToCollaborationRequest = (onSuccess?: () => void) => {
  const { toast } = useToast();

  const respondToCollaborationRequest = async (collaborationId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('club_collaborations')
        .update({ 
          status: accept ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', collaborationId);
      
      if (error) throw error;
      
      toast({
        title: accept ? 'Request Accepted' : 'Request Rejected',
        description: accept 
          ? 'Collaboration request has been accepted.' 
          : 'Collaboration request has been rejected.',
        variant: 'default',
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Error responding to collaboration request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update collaboration request status. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    respondToCollaborationRequest
  };
};
