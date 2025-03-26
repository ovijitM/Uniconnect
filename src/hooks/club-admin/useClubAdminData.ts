
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
  const [maxFetchAttempts] = useState(3);
  
  const { toast } = useToast();
  const { clubEvents, activeEventCount, pastEventCount, averageAttendance, fetchClubEvents } = useClubEvents();
  const { clubMembers, totalMembersCount, fetchClubMembers } = useClubMembers();
  
  const fetchClubAdminData = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    // If we've already tried the maximum number of times, don't try again
    if (fetchAttempts >= maxFetchAttempts) {
      if (adminClubs.length === 0) {
        toast({
          title: 'Network Error',
          description: `Failed to fetch data after ${maxFetchAttempts} attempts. Please check your connection and refresh the page.`,
          variant: 'destructive',
        });
      }
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching club admin data (attempt ${fetchAttempts + 1}/${maxFetchAttempts})`);
      
      // First, get the clubs this user is an admin for
      const { data: clubsData, error: clubsError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);
      
      if (clubsError) {
        if (isNetworkError(clubsError)) {
          throw new Error("Network connectivity issue. Please check your connection.");
        }
        throw clubsError;
      }
      
      const clubIds = clubsData.map(item => item.club_id);
      
      if (clubIds.length === 0) {
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
      
      // Only show toast for first and last attempts
      if (fetchAttempts === 0 || fetchAttempts === maxFetchAttempts - 1) {
        toast({
          title: 'Error',
          description: fetchAttempts === maxFetchAttempts - 1 
            ? 'Last attempt to load dashboard data...' 
            : 'Failed to load dashboard data. Retrying...',
          variant: 'destructive',
        });
      }
      
      // Increment fetch attempts
      setFetchAttempts(prev => prev + 1);
      
      // Only retry if we haven't hit the maximum
      if (fetchAttempts < maxFetchAttempts - 1) {
        const retryDelay = Math.min(1000 * (fetchAttempts + 1), 3000);
        setTimeout(() => {
          fetchClubAdminData();
        }, retryDelay);
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
