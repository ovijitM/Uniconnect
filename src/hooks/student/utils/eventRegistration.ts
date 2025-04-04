import { supabase } from '@/integrations/supabase/client';
import { toast as useToastFunc } from '@/hooks/use-toast';

interface RegistrationOptions {
  onSuccess?: () => void;
  optimistic?: boolean;
}

/**
 * Register a user for an event with optimistic UI updates
 */
export const registerUserForEvent = async (
  userId: string, 
  eventId: string, 
  toast: typeof useToastFunc,
  options: RegistrationOptions = {}
): Promise<boolean> => {
  if (!userId || !eventId) {
    toast({
      title: 'Registration failed',
      description: 'Missing user or event information',
      variant: 'destructive',
    });
    return false;
  }

  try {
    // Check if already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking registration status:', checkError);
      throw checkError;
    }

    if (existingRegistration) {
      toast({
        title: 'Already registered',
        description: 'You are already registered for this event',
        variant: 'default',
      });
      return true;
    }

    // Check event capacity
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('max_participants')
      .eq('id', eventId)
      .single();

    if (eventError) {
      console.error('Error checking event capacity:', eventError);
      throw eventError;
    }

    // Check current participant count
    const { count: currentCount, error: countError } = await supabase
      .from('event_participants')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (countError) {
      console.error('Error checking participant count:', countError);
      throw countError;
    }

    if (eventData.max_participants && currentCount >= eventData.max_participants) {
      toast({
        title: 'Event is full',
        description: 'This event has reached its maximum capacity',
        variant: 'destructive',
      });
      return false;
    }

    // Register for the event
    const { error: registrationError } = await supabase
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: userId,
      });

    if (registrationError) {
      throw registrationError;
    }

    // Success
    toast({
      title: 'Registration successful',
      description: 'You are now registered for this event',
      variant: 'default',
    });

    if (options.onSuccess) {
      options.onSuccess();
    }

    return true;
  } catch (error: any) {
    console.error('Error registering for event:', error);
    
    // Handle unique constraint violation (already registered) gracefully
    if (error.code === '23505') {
      toast({
        title: 'Already registered',
        description: 'You are already registered for this event',
        variant: 'default',
      });
      return true;
    }
    
    // Use action creator function instead of JSX
    toast({
      title: 'Registration failed',
      description: error.message || 'Failed to register for event',
      variant: 'destructive',
      action: {
        label: "Try again",
        onClick: () => registerUserForEvent(userId, eventId, toast, options)
      }
    });
    
    return false;
  }
};

/**
 * Unregister a user from an event with optimistic UI updates
 */
export const unregisterUserFromEvent = async (
  userId: string | undefined,
  eventId: string,
  toast: typeof useToastFunc,
  options: RegistrationOptions = {}
): Promise<boolean> => {
  if (!userId || !eventId) {
    toast({
      title: 'Error',
      description: 'Unable to unregister: Missing user or event information',
      variant: 'destructive',
    });
    return false;
  }

  try {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;

    toast({
      title: 'Success',
      description: 'You have been unregistered from this event',
      variant: 'default',
    });

    if (options.onSuccess) {
      options.onSuccess();
    }

    return true;
  } catch (error: any) {
    console.error('Error unregistering from event:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to unregister from event',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Batch register for multiple events
 */
export const batchRegisterForEvents = async (
  userId: string,
  eventIds: string[],
  toast: typeof useToastFunc
): Promise<boolean> => {
  if (!userId || !eventIds.length) {
    toast({
      title: 'Registration failed',
      description: 'No events selected for registration',
      variant: 'destructive',
    });
    return false;
  }

  try {
    // Create registration entries for all events
    const registrations = eventIds.map(eventId => ({
      event_id: eventId,
      user_id: userId
    }));

    const { error } = await supabase
      .from('event_participants')
      .upsert(registrations, { 
        onConflict: 'event_id,user_id',
        ignoreDuplicates: true
      });

    if (error) throw error;

    toast({
      title: 'Registration successful',
      description: `You are now registered for ${eventIds.length} events`,
      variant: 'default',
    });

    return true;
  } catch (error: any) {
    console.error('Error batch registering for events:', error);
    toast({
      title: 'Registration failed',
      description: error.message || 'Failed to register for selected events',
      variant: 'destructive',
    });
    return false;
  }
};
