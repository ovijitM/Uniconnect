
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JoinClubOptions, LeaveClubOptions } from '../types/studentClubTypes';

/**
 * Join a club with better error handling and logging
 */
export const joinClub = async (
  userId: string,
  clubId: string,
  toast: ReturnType<typeof useToast>['toast'],
  options?: JoinClubOptions
): Promise<boolean> => {
  if (!userId) {
    toast({
      title: 'Authentication Required',
      description: 'Please log in to join clubs',
      variant: 'destructive',
    });
    return false;
  }
  
  try {
    console.log("Attempting to join club:", clubId, "for user:", userId);
    
    // Check if already a member with better error handling
    const { data: existing, error: checkError } = await supabase
      .from('club_members')
      .select('*')
      .eq('user_id', userId)
      .eq('club_id', clubId)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking membership:', checkError);
      throw checkError;
    }
    
    if (existing) {
      console.log("User is already a member of club:", clubId);
      toast({
        title: 'Already a member',
        description: 'You are already a member of this club',
        variant: 'default',
      });
      
      // Return success even though no new membership was created
      if (options?.onSuccess) {
        console.log("Calling onSuccess callback for already-member case");
        options.onSuccess();
      }
      return true;
    }
    
    // Join the club with better logging
    const { error } = await supabase
      .from('club_members')
      .insert({
        user_id: userId,
        club_id: clubId
      });
    
    if (error) {
      console.error('Error joining club:', error);
      
      if (error.code === '23505') {
        console.log("Duplicate key error - already a member");
        toast({
          title: 'Already a member',
          description: 'You are already a member of this club',
          variant: 'default',
        });
        // Call onSuccess even for "already a member" case
        if (options?.onSuccess) {
          console.log("Calling onSuccess callback for duplicate-key case");
          options.onSuccess();
        }
        return true;
      } else {
        throw error;
      }
    }
    
    console.log("Successfully joined club:", clubId);
    toast({
      title: 'Success',
      description: 'You have joined the club successfully',
      variant: 'default',
    });
    
    if (options?.onSuccess) {
      console.log("Calling onSuccess callback for successful join");
      options.onSuccess();
    }
    return true;
  } catch (error: any) {
    console.error('Error joining club:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to join club',
      variant: 'destructive',
    });
    throw error; // Re-throw to allow the component to handle the error
  }
};

/**
 * Leave a club with better error handling and logging
 */
export const leaveClub = async (
  userId: string | undefined,
  clubId: string,
  toast: ReturnType<typeof useToast>['toast'],
  options?: LeaveClubOptions
): Promise<boolean> => {
  if (!userId) {
    toast({
      title: 'Authentication Required',
      description: 'Please log in to leave clubs',
      variant: 'destructive',
    });
    return false;
  }
  
  try {
    console.log("Attempting to leave club:", clubId, "for user:", userId);
    // Enhanced delete operation - first check if membership exists
    const { data: existing, error: checkError } = await supabase
      .from('club_members')
      .select('*')
      .eq('user_id', userId)
      .eq('club_id', clubId)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') { 
      console.error('Error checking membership before leaving:', checkError);
    }
    
    if (!existing) {
      console.log("User is not a member of this club, nothing to leave");
      toast({
        title: 'Not a member',
        description: 'You are not currently a member of this club',
        variant: 'default',
      });
      return true;
    }
    
    // Proceed with delete
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('user_id', userId)
      .eq('club_id', clubId);
    
    if (error) throw error;
    
    console.log("Successfully left club:", clubId);
    toast({
      title: 'Success',
      description: 'You have left the club',
      variant: 'default',
    });
    
    if (options?.onSuccess) {
      console.log("Calling onSuccess callback for successful leave");
      options.onSuccess();
    }
    return true;
  } catch (error: any) {
    console.error('Error leaving club:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to leave club',
      variant: 'destructive',
    });
    return false;
  }
};
