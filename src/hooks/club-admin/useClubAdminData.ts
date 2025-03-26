
import { useState, useEffect } from 'react';
import { useClubMembers } from './useClubMembers';
import { useClubEvents } from './useClubEvents';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isNetworkError } from './utils/dataTransformUtils';

export const useClubAdminData = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [adminClubs, setAdminClubs] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>('');
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;
  
  const { toast } = useToast();
  const { clubEvents, activeEventCount, pastEventCount, averageAttendance, fetchClubEvents } = useClubEvents();
  const { clubMembers, totalMembersCount, fetchClubMembers } = useClubMembers();
  
  const fetchClubAdminData = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    // If we've already tried the maximum number of times, don't try again
    if (fetchAttempts >= MAX_FETCH_ATTEMPTS) {
      console.log(`Max fetch attempts (${MAX_FETCH_ATTEMPTS}) reached, not retrying.`);
      setIsLoading(false);
      
      if (adminClubs.length === 0) {
        toast({
          title: 'Error',
          description: `Failed to fetch data after ${MAX_FETCH_ATTEMPTS} attempts. Please check your connection and refresh the page.`,
          variant: 'destructive',
        });
      }
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching club admin data (attempt ${fetchAttempts + 1}/${MAX_FETCH_ATTEMPTS})`);
      
      // First, get the clubs this user is an admin for
      const { data: clubsData, error: clubsError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);
      
      if (clubsError) {
        console.error('Error fetching club admin data:', clubsError);
        if (isNetworkError(clubsError)) {
          throw new Error("Network connectivity issue. Please check your connection.");
        }
        throw clubsError;
      }
      
      const clubIds = clubsData.map(item => item.club_id);
      
      if (clubIds.length === 0) {
        console.log('No clubs found for this admin');
        setAdminClubs([]);
        setIsLoading(false);
        return;
      }
      
      // Now, fetch the club details
      const { data: clubs, error: clubDetailsError } = await supabase
        .from('clubs')
        .select('*')
        .in('id', clubIds);
      
      if (clubDetailsError) {
        console.error('Error fetching club details:', clubDetailsError);
        if (isNetworkError(clubDetailsError)) {
          throw new Error("Network connectivity issue. Please check your connection.");
        }
        throw clubDetailsError;
      }
      
      setAdminClubs(clubs || []);
      
      // Fetch events for these clubs
      await fetchClubEvents(clubIds);
      
      // Fetch members for these clubs
      await fetchClubMembers(clubIds, clubs || []);
      
      // Reset fetch attempts on success
      setFetchAttempts(0);
    } catch (error: any) {
      console.error('Error fetching club admin data:', error);
      
      // Only retry for network errors
      if (isNetworkError(error) && fetchAttempts < MAX_FETCH_ATTEMPTS - 1) {
        // Show toast for first attempt only
        if (fetchAttempts === 0) {
          toast({
            title: 'Connection Error',
            description: 'Failed to load dashboard data. Will retry automatically.',
            variant: 'destructive',
          });
        }
        
        // Increment fetch attempts
        setFetchAttempts(current => current + 1);
        
        // Exponential backoff for retries
        const retryDelay = Math.min(1000 * Math.pow(2, fetchAttempts), 5000);
        console.log(`Will retry in ${retryDelay}ms (attempt ${fetchAttempts + 1}/${MAX_FETCH_ATTEMPTS})`);
        
        setTimeout(() => {
          fetchClubAdminData();
        }, retryDelay);
      } else {
        // Final error message if max retries reached
        if (fetchAttempts >= MAX_FETCH_ATTEMPTS - 1) {
          toast({
            title: 'Error',
            description: `Failed to load dashboard data after ${MAX_FETCH_ATTEMPTS} attempts. Please refresh the page.`,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectEventForAttendeeManagement = (eventId: string, eventTitle: string) => {
    setSelectedEventId(eventId);
    setSelectedEventTitle(eventTitle);
  };

  useEffect(() => {
    if (userId) {
      // Reset fetch attempts when userId changes
      setFetchAttempts(0);
      fetchClubAdminData();
    }
  }, [userId]);

  return {
    adminClubs,
    clubEvents,
    clubMembers,
    activeEventCount,
    pastEventCount,
    totalMembersCount,
    averageAttendance,
    isLoading,
    fetchClubAdminData,
    selectedEventId,
    selectedEventTitle,
    selectEventForAttendeeManagement
  };
};
