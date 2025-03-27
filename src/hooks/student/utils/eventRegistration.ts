
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RegisterOptions {
  onSuccess?: () => void;
}

export const registerUserForEvent = async (
  userId: string,
  eventId: string,
  toast: ReturnType<typeof useToast>['toast'],
  options?: RegisterOptions
): Promise<void> => {
  if (!userId) {
    toast({
      title: 'Authentication Required',
      description: 'Please log in to register for events',
      variant: 'destructive',
    });
    return;
  }
  
  // Check if already registered
  const { data: existing, error: checkError } = await supabase
    .from('event_participants')
    .select('*')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .maybeSingle();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error("Error checking registration:", checkError);
    throw checkError;
  }
  
  if (existing) {
    console.log("Already registered for this event");
    toast({
      title: 'Already registered',
      description: 'You are already registered for this event',
      variant: 'default',
    });
    return;
  }
  
  // Register for the event
  const { error } = await supabase
    .from('event_participants')
    .insert({
      user_id: userId,
      event_id: eventId
    });
  
  if (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
  
  toast({
    title: 'Success',
    description: 'Successfully registered for the event',
    variant: 'default',
  });
  
  if (options?.onSuccess) options.onSuccess();
};

export const unregisterUserFromEvent = async (
  userId: string | undefined,
  eventId: string,
  toast: ReturnType<typeof useToast>['toast'],
  options?: RegisterOptions
): Promise<void> => {
  if (!userId) return;
  
  const { error } = await supabase
    .from('event_participants')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);
  
  if (error) {
    console.error("Error unregistering from event:", error);
    throw error;
  }
  
  toast({
    title: 'Success',
    description: 'You have unregistered from the event',
    variant: 'default',
  });
  
  if (options?.onSuccess) options.onSuccess();
};
