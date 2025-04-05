
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClubActionCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const joinClub = async (
  userId: string,
  clubId: string,
  toast: ReturnType<typeof useToast>['toast'],
  callbacks?: ClubActionCallbacks
): Promise<boolean> => {
  if (!userId || !clubId) {
    console.error(`Invalid parameters: userId=${userId}, clubId=${clubId}`);
    toast({
      title: 'Error',
      description: 'Unable to join club due to missing information',
      variant: 'destructive',
    });
    return false;
  }

  try {
    console.log(`Attempting to join club ${clubId} for user ${userId}`);
    
    // First check if user is already a member
    const { data: existingMembership, error: checkError } = await supabase
      .from('club_members')
      .select('*')
      .eq('user_id', userId)
      .eq('club_id', clubId)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing membership:', checkError);
    }
    
    if (existingMembership) {
      console.log(`User ${userId} is already a member of club ${clubId}`);
      toast({
        title: 'Already a member',
        description: 'You are already a member of this club',
        variant: 'default',
      });
      if (callbacks?.onSuccess) callbacks.onSuccess();
      return true;
    }

    // Join the club
    const { error } = await supabase
      .from('club_members')
      .insert({
        club_id: clubId,
        user_id: userId,
      });

    if (error) {
      if (error.code === '23505') {  // Duplicate key error
        console.log(`User ${userId} is already a member of club ${clubId} (detected by constraint)`);
        toast({
          title: 'Already a member',
          description: 'You are already a member of this club',
          variant: 'default',
        });
        
        if (callbacks?.onSuccess) callbacks.onSuccess();
        return true;
      } else {
        console.error('Error joining club:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to join club',
          variant: 'destructive',
        });
        
        if (callbacks?.onError) callbacks.onError(new Error(error.message));
        return false;
      }
    }

    console.log(`Successfully joined club ${clubId} for user ${userId}`);
    toast({
      title: 'Success',
      description: 'You have successfully joined this club',
      variant: 'default',
    });
    
    if (callbacks?.onSuccess) {
      console.log("Calling onSuccess callback after joining club");
      callbacks.onSuccess();
    }
    return true;
  } catch (error: any) {
    console.error('Error in joinClub function:', error);
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    
    if (callbacks?.onError) callbacks.onError(error);
    return false;
  }
};

export const leaveClub = async (
  userId: string | undefined,
  clubId: string,
  toast: ReturnType<typeof useToast>['toast'],
  callbacks?: ClubActionCallbacks
): Promise<boolean> => {
  if (!userId || !clubId) {
    console.error(`Invalid parameters for leaveClub: userId=${userId}, clubId=${clubId}`);
    toast({
      title: 'Error',
      description: 'Unable to leave club due to missing information',
      variant: 'destructive',
    });
    return false;
  }

  try {
    console.log(`Attempting to leave club ${clubId} for user ${userId}`);
    
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('user_id', userId)
      .eq('club_id', clubId);

    if (error) {
      console.error('Error leaving club:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to leave club',
        variant: 'destructive',
      });
      
      if (callbacks?.onError) callbacks.onError(new Error(error.message));
      return false;
    }

    console.log(`Successfully left club ${clubId} for user ${userId}`);
    toast({
      title: 'Success',
      description: 'You have successfully left this club',
      variant: 'default',
    });
    
    if (callbacks?.onSuccess) {
      console.log("Calling onSuccess callback after leaving club");
      callbacks.onSuccess();
    }
    return true;
  } catch (error: any) {
    console.error('Error in leaveClub function:', error);
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
    
    if (callbacks?.onError) callbacks.onError(error);
    return false;
  }
};
