
import { useEventFetch } from './event-detail/useEventFetch';
import { useEventParticipation } from './event-detail/useEventParticipation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export const useEventDetail = (eventId?: string) => {
  const { event, setEvent, isLoading } = useEventFetch(eventId);
  const { user } = useAuth();
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const [canAccess, setCanAccess] = useState<boolean>(true);
  const { isParticipating, handleParticipate, handleUnregister } = useEventParticipation(
    eventId,
    event,
    setEvent
  );

  // Check if user has access to university-only events
  useEffect(() => {
    const checkUniversityAccess = async () => {
      if (!user || !event) return;
      
      // If event is public, allow access
      if (event.visibility !== 'university_only') {
        setCanAccess(true);
        return;
      }
      
      try {
        // Get user's university
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('university')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setUserUniversity(profileData.university);
        
        // Check if user's university matches the event's club university
        setCanAccess(profileData.university === event.organizer.university);
      } catch (error) {
        console.error('Error checking university access:', error);
        setCanAccess(false);
      }
    };
    
    checkUniversityAccess();
  }, [user, event]);

  return {
    event,
    isLoading,
    isParticipating,
    canAccess,
    userUniversity,
    handleParticipate,
    handleUnregister
  };
};
