
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEventFetch } from './event-detail/useEventFetch';
import { useEventParticipation } from './event-detail/useEventParticipation';
import { useToast } from './use-toast';

export const useEventDetail = (eventId: string | undefined) => {
  const { user } = useAuth();
  const { event, isLoading, error } = useEventFetch(eventId);
  const { toast } = useToast();
  const [canAccess, setCanAccess] = useState(true);
  
  const { 
    isParticipating,
    handleParticipate,
    handleUnregister
  } = useEventParticipation(eventId, event);

  // Check if the user can access the event based on visibility restrictions
  useEffect(() => {
    async function checkEventAccess() {
      if (!event || !user || event.visibility !== 'university_only') {
        setCanAccess(true);
        return;
      }

      try {
        // Get the user's university
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('university, university_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setCanAccess(false);
          return;
        }

        // Handle case when event.organizer might be undefined
        const organizerUniversity = event.organizer?.university || '';
        
        // Check if the user's university matches the organizer's university
        setCanAccess(!!profileData && profileData.university === organizerUniversity);
        
      } catch (error) {
        console.error('Error checking event access:', error);
        setCanAccess(false);
      }
    }

    checkEventAccess();
  }, [event, user]);

  return {
    event,
    isLoading,
    isParticipating,
    canAccess,
    handleParticipate,
    handleUnregister,
    error
  };
};
