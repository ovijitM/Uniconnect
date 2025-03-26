
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentClubs } from './student/useStudentClubs';
import { useStudentEvents } from './student/useStudentEvents';
import { useStudentProfile } from './student/useStudentProfile';

export const useStudentData = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    userUniversity, 
    fetchUserProfile,
    updateUserUniversity 
  } = useStudentProfile(user?.id);
  
  const { 
    clubs, 
    joinedClubs, 
    fetchClubs, 
    joinClub, 
    leaveClub,
    isLoadingClubs
  } = useStudentClubs(user?.id, fetchData);
  
  const { 
    events, 
    registeredEvents, 
    fetchEvents, 
    registerForEvent, 
    unregisterFromEvent,
    isLoadingEvents
  } = useStudentEvents(user?.id, fetchData);

  async function fetchData() {
    setIsLoading(true);
    try {
      await fetchUserProfile();
      await fetchClubs(userUniversity);
      await fetchEvents(userUniversity);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Refetch data when university changes
  useEffect(() => {
    if (user && userUniversity) {
      fetchClubs(userUniversity);
      fetchEvents(userUniversity);
    }
  }, [userUniversity]);

  return {
    isLoading: isLoading || isLoadingClubs || isLoadingEvents,
    clubs,
    events,
    joinedClubs,
    registeredEvents,
    userUniversity,
    updateUserUniversity,
    joinClub,
    leaveClub,
    registerForEvent,
    unregisterFromEvent
  };
};
