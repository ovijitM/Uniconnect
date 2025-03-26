
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClubEvents = () => {
  const { toast } = useToast();
  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [activeEventCount, setActiveEventCount] = useState(0);
  const [pastEventCount, setPastEventCount] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);

  const fetchClubEvents = async (clubIds: string[]) => {
    if (!clubIds.length) {
      setClubEvents([]);
      setActiveEventCount(0);
      setPastEventCount(0);
      setAverageAttendance(0);
      return [];
    }
    
    try {
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
      
      // Calculate average attendance - fix the property access
      const eventsWithAttendance = eventsData.filter(event => 
        event.event_participants && 
        Array.isArray(event.event_participants) && 
        event.event_participants.length > 0
      );
      
      if (eventsWithAttendance.length > 0) {
        let totalAttendance = 0;
        for (const event of eventsWithAttendance) {
          if (Array.isArray(event.event_participants) && event.event_participants.length > 0) {
            // Safely extract the count value
            const countData = event.event_participants[0];
            
            // Handle the count value which might be a string, number, or have a count property
            let count = 0;
            if (typeof countData === 'number') {
              count = countData;
            } else if (typeof countData === 'string') {
              count = parseInt(countData, 10) || 0;
            } else if (countData && typeof countData === 'object') {
              // It might be an object with a count property
              const rawCount = countData.count;
              if (typeof rawCount === 'number') {
                count = rawCount;
              } else if (typeof rawCount === 'string') {
                count = parseInt(rawCount, 10) || 0;
              }
            }
            
            totalAttendance += isNaN(count) ? 0 : count;
          }
        }
        setAverageAttendance(Math.round(totalAttendance / eventsWithAttendance.length));
      }
      
      return eventsData;
    } catch (error) {
      console.error('Error fetching club events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events data. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    clubEvents,
    activeEventCount,
    pastEventCount,
    averageAttendance,
    fetchClubEvents
  };
};
