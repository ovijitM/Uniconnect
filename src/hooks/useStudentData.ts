
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
    isLoadingProfile,
    error: profileError,
    updateUserUniversity 
  } = useStudentProfile(user?.id);
  
  const { 
    clubs, 
    joinedClubs, 
    joinedClubIds,
    fetchClubs, 
    joinClub: joinClubAction, 
    leaveClub: leaveClubAction,
    isLoadingClubs,
    error: clubsError
  } = useStudentClubs(user?.id, fetchData);
  
  const { 
    events, 
    registeredEvents, 
    registeredEventIds,
    fetchEvents, 
    registerForEvent, 
    unregisterFromEvent,
    isLoadingEvents,
    error: eventsError
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
      
      if (profileError) {
        console.warn("Profile error detected:", profileError);
        // Don't return here, still try to fetch other data
      }
      
      if (userUniversity) {
        console.log("Fetching data for university:", userUniversity);
        try {
          await fetchClubs(userUniversity);
        } catch (clubErr: any) {
          console.error('Error fetching clubs:', clubErr);
          // Continue to fetch events even if clubs fail
        }
        
        try {
          await fetchEvents(userUniversity);
        } catch (eventErr: any) {
          console.error('Error fetching events:', eventErr);
        }
      } else {
        console.log("No university set for user, fetching public data only");
        try {
          await fetchClubs(null);
        } catch (clubErr: any) {
          console.error('Error fetching clubs:', clubErr);
        }
        
        try {
          await fetchEvents(null);
        } catch (eventErr: any) {
          console.error('Error fetching events:', eventErr);
        }
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
  
  // Determine overall error state
  useEffect(() => {
    const combinedError = profileError || clubsError || eventsError;
    if (combinedError && !isLoading && !isLoadingProfile && !isLoadingClubs && !isLoadingEvents) {
      setError(combinedError);
    } else if (!isLoading && !isLoadingProfile && !isLoadingClubs && !isLoadingEvents) {
      setError(null);
    }
  }, [profileError, clubsError, eventsError, isLoading, isLoadingProfile, isLoadingClubs, isLoadingEvents]);
  
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
      console.log("User detected, fetching initial data");
      fetchData();
    } else {
      console.log("No user detected, skipping data fetch");
      setIsLoading(false);
    }
  }, [user?.id]); // Only depend on user.id, not the entire user object

  // Refetch data when university changes
  useEffect(() => {
    if (user?.id && userUniversity) {
      console.log("University changed, refreshing data:", userUniversity);
      fetchClubs(userUniversity);
      fetchEvents(userUniversity);
    }
  }, [userUniversity]);

  return {
    isLoading: isLoading || isLoadingClubs || isLoadingEvents || isLoadingProfile,
    error,
    clubs,
    events,
    joinedClubs,
    joinedClubIds,
    registeredEvents,
    registeredEventIds,
    userUniversity,
    updateUserUniversity,
    joinClub,
    leaveClub,
    registerForEvent,
    unregisterFromEvent,
    refreshData: fetchData
  };
};
