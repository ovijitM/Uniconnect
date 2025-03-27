
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentClubs } from './student/useStudentClubs';
import { useStudentEvents } from './student/useStudentEvents';
import { useStudentProfile } from './student/useStudentProfile';
import { useToast } from '@/hooks/use-toast';

export const useStudentData = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    userUniversity, 
    fetchUserProfile,
    updateUserUniversity 
  } = useStudentProfile(user?.id);
  
  const { 
    clubs, 
    joinedClubs, 
    joinedClubIds,
    fetchClubs, 
    joinClub: joinClubAction, 
    leaveClub: leaveClubAction,
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
    setError(null);
    try {
      console.log("Fetching all student data for user:", user?.id);
      if (!user?.id) {
        console.error("Cannot fetch data: No user ID");
        setError("User not authenticated");
        return;
      }
      
      await fetchUserProfile();
      
      if (userUniversity) {
        console.log("Fetching data for university:", userUniversity);
        await Promise.all([
          fetchClubs(userUniversity),
          fetchEvents(userUniversity)
        ]);
      } else {
        console.log("No university set for user, fetching public data only");
        await Promise.all([
          fetchClubs(null),
          fetchEvents(null)
        ]);
      }
    } catch (err: any) {
      console.error('Error in fetchData:', err);
      setError(err?.message || 'Failed to load data');
      toast({
        title: 'Error loading data',
        description: err?.message || 'Failed to load content. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Wrapper for joinClub to ensure state is refreshed
  const joinClub = async (clubId: string) => {
    try {
      await joinClubAction(clubId);
      // Explicit club data refresh to ensure everything is up to date
      await fetchClubs(userUniversity);
    } catch (err: any) {
      console.error('Error joining club:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Failed to join club',
        variant: 'destructive',
      });
    }
  };
  
  // Wrapper for leaveClub to ensure state is refreshed
  const leaveClub = async (clubId: string) => {
    try {
      await leaveClubAction(clubId);
      // Explicit club data refresh to ensure everything is up to date
      await fetchClubs(userUniversity);
    } catch (err: any) {
      console.error('Error leaving club:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Failed to leave club',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Refetch data when university changes
  useEffect(() => {
    if (user && userUniversity) {
      console.log("University changed, refreshing data:", userUniversity);
      fetchClubs(userUniversity);
      fetchEvents(userUniversity);
    }
  }, [userUniversity]);

  return {
    isLoading: isLoading || isLoadingClubs || isLoadingEvents,
    error,
    clubs,
    events,
    joinedClubs,
    joinedClubIds,
    registeredEvents,
    userUniversity,
    updateUserUniversity,
    joinClub,
    leaveClub,
    registerForEvent,
    unregisterFromEvent,
    refreshData: fetchData
  };
};
