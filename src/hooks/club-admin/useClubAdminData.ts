import { useState, useEffect } from 'react';
import { useClubMembers } from './useClubMembers';
import { useClubEvents } from './useClubEvents';
import { useAdminClubs } from '@/hooks/admin/useAdminClubs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClubAdminData = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [adminClubs, setAdminClubs] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>('');
  
  const { toast } = useToast();
  const { clubEvents, activeEventCount, pastEventCount, averageAttendance, fetchClubEvents } = useClubEvents();
  const { clubMembers, totalMembersCount, fetchClubMembers } = useClubMembers();
  
  const fetchClubAdminData = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // First, get the clubs this user is an admin for
      const { data: clubsData, error: clubsError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);
      
      if (clubsError) throw clubsError;
      
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
      
      if (clubDetailsError) throw clubDetailsError;
      
      setAdminClubs(clubs || []);
      
      // Fetch events for these clubs
      await fetchClubEvents(clubIds);
      
      // Fetch members for these clubs
      await fetchClubMembers(clubIds, clubs || []);
    } catch (error) {
      console.error('Error fetching club admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectEventForAttendeeManagement = (eventId: string, eventTitle: string) => {
    setSelectedEventId(eventId);
    setSelectedEventTitle(eventTitle);
  };

  useEffect(() => {
    fetchClubAdminData();
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
