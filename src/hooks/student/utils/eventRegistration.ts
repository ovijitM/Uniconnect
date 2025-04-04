
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import React from 'react';
import { RegisterOptions } from '../types/studentEventTypes';

/**
 * Registers a user for an event
 */
export const registerForEvent = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  if (!userId || !eventId) {
    console.error('Missing user ID or event ID');
    
    toast.error('Registration failed', {
      description: 'Missing required information',
      action: {
        label: 'Retry',
        onClick: () => {}
      }
    });
    
    return false;
  }
  
  try {
    // Check if already registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_participants')
      .select('*')
      .eq('user_id', userId)
      .eq('event_id', eventId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    if (existingRegistration) {
      toast.info('Already registered', {
        description: 'You are already registered for this event'
      });
      return true;
    }
    
    // Insert new registration
    const { error: insertError } = await supabase
      .from('event_participants')
      .insert({
        user_id: userId,
        event_id: eventId
      });
    
    if (insertError) {
      throw insertError;
    }
    
    toast.success('Registration successful', {
      description: 'You have been registered for this event'
    });
    
    return true;
  } catch (error) {
    console.error('Error registering for event:', error);
    
    toast.error('Registration failed', {
      description: 'An error occurred while registering. Please try again.',
      action: {
        label: 'Retry',
        onClick: () => registerForEvent(userId, eventId)
      }
    });
    
    return false;
  }
};

/**
 * Unregisters a user from an event
 */
export const unregisterFromEvent = async (
  userId: string,
  eventId: string
): Promise<boolean> => {
  if (!userId || !eventId) {
    console.error('Missing user ID or event ID');
    
    toast.error('Unregistration failed', {
      description: 'Missing required information',
      action: {
        label: 'Retry',
        onClick: () => {}
      }
    });
    
    return false;
  }
  
  try {
    // Delete registration
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId);
    
    if (error) {
      throw error;
    }
    
    toast.success('Unregistered successfully', {
      description: 'You have been removed from this event'
    });
    
    return true;
  } catch (error) {
    console.error('Error unregistering from event:', error);
    
    toast.error('Unregistration failed', {
      description: 'An error occurred. Please try again.',
      action: {
        label: 'Retry',
        onClick: () => unregisterFromEvent(userId, eventId)
      }
    });
    
    return false;
  }
};

/**
 * Helper functions for using in other components
 */
export const registerUserForEvent = async (
  userId: string,
  eventId: string,
  toastFn: any,
  options?: RegisterOptions
): Promise<boolean> => {
  const success = await registerForEvent(userId, eventId);
  if (success && options?.onSuccess) {
    options.onSuccess();
  }
  return success;
};

export const unregisterUserFromEvent = async (
  userId: string,
  eventId: string,
  toastFn: any,
  options?: RegisterOptions
): Promise<boolean> => {
  const success = await unregisterFromEvent(userId, eventId);
  if (success && options?.onSuccess) {
    options.onSuccess();
  }
  return success;
};
