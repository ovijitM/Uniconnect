
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JoinClubOptions, LeaveClubOptions } from '../types/studentClubTypes';

export const joinClub = async (
  userId: string,
  clubId: string,
  toast: ReturnType<typeof useToast>['toast'],
  options?: JoinClubOptions
): Promise<void> => {
  if (!userId) {
    toast({
      title: 'Authentication Required',
      description: 'Please log in to join clubs',
      variant: 'destructive',
    });
    return;
  }
  
  try {
    console.log("Attempting to join club:", clubId, "for user:", userId);
    
    // Check if already a member
    const { data: existing, error: checkError } = await supabase
      .from('club_members')
      .select('*')
      .eq('user_id', userId)
      .eq('club_id', clubId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking membership:', checkError);
      throw checkError;
    }
    
    if (existing) {
      toast({
        title: 'Already a member',
        description: 'You are already a member of this club',
        variant: 'default',
      });
      return;
    }
    
    // Join the club - ensure we're inserting with correct user_id
    const { error } = await supabase
      .from('club_members')
      .insert({
        user_id: userId,
        club_id: clubId
      });
    
    if (error) {
      console.error('Error joining club:', error);
      
      if (error.code === '23505') {
        toast({
          title: 'Already a member',
          description: 'You are already a member of this club',
          variant: 'default',
        });
      } else if (error.message?.includes('row-level security policy')) {
        throw new Error('Permission denied. You may not have the right privileges to join this club.');
      } else {
        throw error;
      }
      return;
    }
    
    toast({
      title: 'Success',
      description: 'You have joined the club successfully',
      variant: 'default',
    });
    
    if (options?.onSuccess) options.onSuccess();
  } catch (error: any) {
    console.error('Error joining club:', error);
    throw error; // Re-throw to allow the component to handle the error
  }
};

export const leaveClub = async (
  userId: string | undefined,
  clubId: string,
  toast: ReturnType<typeof useToast>['toast'],
  options?: LeaveClubOptions
): Promise<void> => {
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('user_id', userId)
      .eq('club_id', clubId);
    
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'You have left the club',
      variant: 'default',
    });
    
    if (options?.onSuccess) options.onSuccess();
  } catch (error) {
    console.error('Error leaving club:', error);
    toast({
      title: 'Error',
      description: 'Failed to leave club',
      variant: 'destructive',
    });
  }
};
