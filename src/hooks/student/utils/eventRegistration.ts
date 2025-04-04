
import { supabase } from '@/integrations/supabase/client';

// Define a type for registration options
interface RegisterOptions {
  onSuccess?: () => void;
}

/**
 * Registers a user for an event
 */
export const registerUserForEvent = async (
  userId: string, 
  eventId: string, 
  toast: any,
  options?: RegisterOptions
) => {
  try {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for events",
        variant: "destructive",
        action: {
          label: "Try again",
          altText: "Try again",
          onClick: () => {}
        }
      });
      return false;
    }
    
    // Check if already registered
    const { data: existingRegistration } = await supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingRegistration) {
      toast({
        title: "Already registered",
        description: "You are already registered for this event",
        variant: "default",
      });
      return false;
    }
    
    // Register for the event
    const { error } = await supabase
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: userId,
        created_at: new Date().toISOString(),
        checked_in: false
      });
    
    if (error) {
      console.error('Error registering for event:', error);
      
      if (error.code === '23505') { // Duplicate key error
        toast({
          title: "Already registered",
          description: "You are already registered for this event",
          variant: "default",
        });
        
        if (options?.onSuccess) {
          options.onSuccess();
        }
        
        return true; // Consider this a success since the user is registered
      }
      
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
        action: {
          label: "Try again",
          altText: "Try again",
          onClick: () => {}
        }
      });
      return false;
    }
    
    toast({
      title: "Successfully registered!",
      description: "You have successfully registered for this event",
      variant: "default",
    });
    
    if (options?.onSuccess) {
      options.onSuccess();
    }
    
    return true;
  } catch (error: any) {
    console.error('Error registering for event:', error);
    
    toast({
      title: "Registration failed",
      description: error.message || "Something went wrong",
      variant: "destructive",
      action: {
        label: "Try again",
        altText: "Try again",
        onClick: () => {}
      }
    });
    
    return false;
  }
};

/**
 * Unregisters a user from an event
 */
export const unregisterUserFromEvent = async (
  userId: string | undefined, 
  eventId: string, 
  toast: any,
  options?: RegisterOptions
) => {
  try {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to unregister from events",
        variant: "destructive",
        action: {
          label: "Try again",
          altText: "Try again",
          onClick: () => {}
        }
      });
      return false;
    }
    
    // Unregister from the event
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error unregistering from event:', error);
      toast({
        title: "Unregistration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
        action: {
          label: "Try again",
          altText: "Try again",
          onClick: () => {}
        }
      });
      return false;
    }
    
    toast({
      title: "Successfully unregistered",
      description: "You have been unregistered from this event",
      variant: "default",
    });
    
    if (options?.onSuccess) {
      options.onSuccess();
    }
    
    return true;
  } catch (error: any) {
    console.error('Error unregistering from event:', error);
    
    toast({
      title: "Unregistration failed",
      description: error.message || "Something went wrong",
      variant: "destructive",
      action: {
        label: "Try again",
        altText: "Try again",
        onClick: () => {}
      }
    });
    
    return false;
  }
};
