
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClubAdminData = (userId: string | undefined) => {
  const { toast } = useToast();
  
  const [adminClubs, setAdminClubs] = useState<any[]>([]);
  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [activeEventCount, setActiveEventCount] = useState(0);
  const [pastEventCount, setPastEventCount] = useState(0);
  const [totalMembersCount, setTotalMembersCount] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClubAdminData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Fetch clubs where the current user is an admin
      const { data: clubAdminData, error: clubAdminError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);

      if (clubAdminError) throw clubAdminError;

      // If user is not an admin of any clubs, show empty state
      if (clubAdminData.length === 0) {
        setAdminClubs([]);
        setClubEvents([]);
        setClubMembers([]);
        setActiveEventCount(0);
        setPastEventCount(0);
        setTotalMembersCount(0);
        setAverageAttendance(0);
        setIsLoading(false);
        return;
      }

      const clubIds = clubAdminData.map(ca => ca.club_id);
      
      // Fetch clubs data
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*')
        .in('id', clubIds);
      
      if (clubsError) throw clubsError;
      
      setAdminClubs(clubsData);

      // Fetch events for these clubs
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          date,
          location,
          category,
          status,
          max_participants,
          club_id,
          event_participants(count)
        `)
        .in('club_id', clubIds)
        .order('date', { ascending: true });
      
      if (eventsError) throw eventsError;
      
      setClubEvents(eventsData);
      
      // Count active (upcoming + ongoing) and past events
      const active = eventsData.filter(event => ['upcoming', 'ongoing'].includes(event.status)).length;
      const past = eventsData.filter(event => event.status === 'past').length;
      
      setActiveEventCount(active);
      setPastEventCount(past);
      
      // Calculate average attendance
      const eventsWithAttendance = eventsData.filter(event => event.event_participants[0]?.count);
      if (eventsWithAttendance.length > 0) {
        const totalAttendance = eventsWithAttendance.reduce((sum, event) => sum + event.event_participants[0]?.count || 0, 0);
        setAverageAttendance(Math.round(totalAttendance / eventsWithAttendance.length));
      }
      
      // Fetch members for these clubs
      let totalMembers = 0;
      const allMembersPromises = clubIds.map(async (clubId) => {
        const { data: membersData, error: membersError } = await supabase
          .from('club_members')
          .select(`
            user_id,
            created_at,
            profiles(name, email)
          `)
          .eq('club_id', clubId);
        
        if (membersError) throw membersError;
        
        totalMembers += membersData.length;
        return membersData.map(member => ({
          ...member,
          clubId,
          clubName: clubsData.find(club => club.id === clubId)?.name || 'Unknown Club'
        }));
      });
      
      const allMembersArrays = await Promise.all(allMembersPromises);
      const allMembers = allMembersArrays.flat();
      
      setClubMembers(allMembers);
      setTotalMembersCount(totalMembers);
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
