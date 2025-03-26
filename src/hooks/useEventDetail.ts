
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
      // Default to true for public events or when no event data yet
      if (!event) {
        setCanAccess(true);
        return;
      }
      
      // If event visibility is public, everyone can access
      if (event.visibility !== 'university_only') {
        setCanAccess(true);
        return;
      }
      
      // For university_only events, check user authorization
      if (!user) {
        console.log('University-only event, but no user logged in');
        setCanAccess(false);
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

        if (!profileData) {
          console.error('No profile found for user:', user.id);
          setCanAccess(false);
          return;
        }

        // Get the event's university from the organizer
        const organizerUniversity = event.organizer?.university || '';
        console.log(`Checking access: User university: ${profileData.university}, Event university: ${organizerUniversity}`);
        
        // Check if the user's university matches the organizer's university
        const hasAccess = profileData.university === organizerUniversity;
        setCanAccess(hasAccess);
        
        if (!hasAccess) {
          console.log('Access denied: University mismatch');
        }
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
