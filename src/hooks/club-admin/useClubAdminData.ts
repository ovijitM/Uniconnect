
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchAdminClubsMemoized, 
  fetchClubEvents, 
  fetchEventStatistics 
} from './utils/clubFetching';
import { useClubMembers } from './useClubMembers';
import { Club } from '@/types';

export const useClubAdminData = (userId: string | undefined) => {
  const { toast } = useToast();
  
  // State
  const [adminClubs, setAdminClubs] = useState<Club[]>([]);
  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [activeEventCount, setActiveEventCount] = useState(0);
  const [pastEventCount, setPastEventCount] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  
  const { clubMembers, totalMembersCount, fetchClubMembers } = useClubMembers();
  
  // Fetch club admin data with efficient error handling and loading state management
  const fetchClubAdminData = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Fetch clubs administered by the user (using memoized function)
      const clubs = await fetchAdminClubsMemoized(userId);
      setAdminClubs(clubs);
      
      if (clubs.length === 0) {
        setIsLoading(false);
        return;
      }
      
      const clubIds = clubs.map(club => club.id);
      
      // Parallel fetching for better performance
      const [events, members, statistics] = await Promise.all([
        fetchClubEvents(clubIds),
        fetchClubMembers(clubIds, clubs),
        fetchEventStatistics(clubIds)
      ]);
      
      setClubEvents(events || []);
      setActiveEventCount(statistics.activeEventCount);
      setPastEventCount(statistics.pastEventCount);
      setAverageAttendance(statistics.averageAttendance);
      
      console.log(`Dashboard data loaded: ${clubs.length} clubs, ${events?.length || 0} events, ${totalMembersCount} members`);
      
    } catch (error: any) {
      console.error('Error in fetchClubAdminData:', error);
      setErrorMessage(error.message || 'Failed to load dashboard data');
      
      toast({
        title: "Error",
        description: "Failed to load club admin dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, fetchClubMembers, totalMembersCount]);
  
  // Initialize data fetching
  useEffect(() => {
    if (userId) {
      fetchClubAdminData();
    }
  }, [userId, fetchClubAdminData]);
  
  // Optimize event selection with useCallback
  const selectEventForAttendeeManagement = useCallback((eventId: string, eventTitle: string) => {
    setSelectedEventId(eventId);
    setSelectedEventTitle(eventTitle);
  }, []);

  return {
    adminClubs,
    clubEvents,
    clubMembers,
    activeEventCount,
    pastEventCount,
    totalMembersCount,
    averageAttendance,
    isLoading,
    errorMessage,
    fetchClubAdminData,
    selectedEventId,
    selectedEventTitle,
    selectEventForAttendeeManagement
  };
};
