
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStudentData = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch clubs the student has joined
        const { data: membershipData, error: membershipError } = await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', user.id);

        if (membershipError) throw membershipError;
        
        const clubIds = membershipData?.map(item => item.club_id) || [];
        
        // Fetch detailed club information
        let { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('*')
          .in('id', clubIds.length ? clubIds : ['00000000-0000-0000-0000-000000000000']); // Use a dummy ID if no clubs
          
        if (clubsError) throw clubsError;
        setJoinedClubs(clubsData || []);
        
        // Fetch events the student has registered for
        const { data: participationData, error: participationError } = await supabase
          .from('event_participants')
          .select('event_id')
          .eq('user_id', user.id);
        
        if (participationError) throw participationError;
        
        const eventIds = participationData?.map(item => item.event_id) || [];
        
        // Fetch detailed event information
        let { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .in('id', eventIds.length ? eventIds : ['00000000-0000-0000-0000-000000000000']) // Use a dummy ID if no events
          .order('date', { ascending: true });
        
        if (eventsError) throw eventsError;
        setRegisteredEvents(eventsData || []);
        
        // Fetch all available clubs
        const { data: allClubs, error: allClubsError } = await supabase
          .from('clubs')
          .select('*');
        
        if (allClubsError) throw allClubsError;
        setClubs(allClubs || []);
        
        // Fetch upcoming events
        const { data: upcomingEvents, error: upcomingEventsError } = await supabase
          .from('events')
          .select(`
            *,
            clubs (
              name
            )
          `)
          .eq('status', 'upcoming')
          .order('date', { ascending: true });
        
        if (upcomingEventsError) throw upcomingEventsError;
        setEvents(upcomingEvents || []);
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Function to join a club
  const joinClub = async (clubId: string) => {
    if (!user) return;
    
    try {
      // Check if already a member
      const { data: existing, error: checkError } = await supabase
        .from('club_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('club_id', clubId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected if not joined
        throw checkError;
      }
      
      if (existing) {
        toast.info('You are already a member of this club');
        return;
      }
      
      // Join the club
      const { error } = await supabase
        .from('club_members')
        .insert({
          user_id: user.id,
          club_id: clubId
        });
      
      if (error) throw error;
      
      toast.success('Successfully joined the club');
      
      // Update the local state
      const club = clubs.find(c => c.id === clubId);
      if (club) {
        setJoinedClubs(prev => [...prev, club]);
      }
    } catch (error) {
      console.error('Error joining club:', error);
      toast.error('Failed to join club');
    }
  };

  // Function to register for an event
  const registerForEvent = async (eventId: string) => {
    if (!user) return;
    
    try {
      // Check if already registered
      const { data: existing, error: checkError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existing) {
        toast.info('You are already registered for this event');
        return;
      }
      
      // Register for the event
      const { error } = await supabase
        .from('event_participants')
        .insert({
          user_id: user.id,
          event_id: eventId
        });
      
      if (error) throw error;
      
      toast.success('Successfully registered for the event');
      
      // Update the local state
      const event = events.find(e => e.id === eventId);
      if (event) {
        setRegisteredEvents(prev => [...prev, event]);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register for event');
    }
  };

  return {
    isLoading,
    clubs,
    events,
    joinedClubs,
    registeredEvents,
    joinClub,
    registerForEvent
  };
};
