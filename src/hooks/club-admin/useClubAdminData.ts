
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdminClubs } from './useAdminClubs';
import { useClubEvents } from './useClubEvents';
import { useClubMembers } from './useClubMembers';

export const useClubAdminData = (userId: string | undefined) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    adminClubs, 
    fetchAdminClubs,
    setIsLoading: setClubsLoading 
  } = useAdminClubs(userId);
  
  const { 
    clubEvents, 
    activeEventCount, 
    pastEventCount, 
    averageAttendance, 
    fetchClubEvents 
  } = useClubEvents();
  
  const { 
    clubMembers, 
    totalMembersCount, 
    fetchClubMembers 
  } = useClubMembers();

  const fetchClubAdminData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setClubsLoading(true);
    
    try {
      // Fetch clubs first
      const clubs = await fetchAdminClubs();
      
      if (clubs.length === 0) {
        setIsLoading(false);
        setClubsLoading(false);
        return;
      }
      
      const clubIds = clubs.map((club: any) => club.id);
      
      // Fetch events and members in parallel
      await Promise.all([
        fetchClubEvents(clubIds),
        fetchClubMembers(clubIds, clubs)
      ]);
      
    } catch (error) {
      console.error('Error fetching club admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setClubsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
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
  };
};
