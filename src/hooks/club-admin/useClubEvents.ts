
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClubEvents = () => {
  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [activeEventCount, setActiveEventCount] = useState(0);
  const [pastEventCount, setPastEventCount] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClubEvents = async (clubIds: string[]) => {
    if (!clubIds || clubIds.length === 0) {
      setClubEvents([]);
      setActiveEventCount(0);
      setPastEventCount(0);
      setAverageAttendance(0);
      return;
    }
    
    try {
      console.log("Fetching events for clubs:", clubIds);
      
      // Fetch all events for the clubs
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          event_participants(count)
        `)
        .in('club_id', clubIds);
      
      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        throw eventsError;
      }
      
      console.log("Events fetched:", eventsData);
      setClubEvents(eventsData || []);
      
      // Count active and past events
      const now = new Date();
      const active = eventsData?.filter(event => new Date(event.date) >= now) || [];
      const past = eventsData?.filter(event => new Date(event.date) < now) || [];
      
      setActiveEventCount(active.length);
      setPastEventCount(past.length);
      
      // Calculate average attendance
      if (past.length > 0) {
        const totalAttendance = past.reduce((sum, event) => {
          return sum + (event.event_participants[0]?.count || 0);
        }, 0);
        setAverageAttendance(Math.round(totalAttendance / past.length));
      } else {
        setAverageAttendance(0);
      }
      
    } catch (error) {
      console.error('Error fetching club events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    clubEvents,
    activeEventCount,
    pastEventCount,
    averageAttendance,
    fetchClubEvents,
    isLoading,
    setIsLoading
  };
};
