
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, Club } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useHomePageData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch clubs from Supabase with status filter
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('*')
          .eq('status', 'approved');
        
        if (clubsError) throw clubsError;
        
        // Get club members count for each club
        const clubsWithCounts = await Promise.all(
          clubsData.map(async (club) => {
            const { count, error: countError } = await supabase
              .from('club_members')
              .select('*', { count: 'exact', head: true })
              .eq('club_id', club.id);
            
            return {
              id: club.id,
              name: club.name,
              description: club.description,
              logoUrl: club.logo_url,
              category: club.category,
              memberCount: count || 0,
              status: club.status,
              events: []
            };
          })
        );
        
        // Fetch events from Supabase
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*, clubs!inner(*)')
          .eq('clubs.status', 'approved')
          .order('date');
        
        if (eventsError) throw eventsError;
        
        // Get participants count and club details for each event
        const eventsWithDetails = await Promise.all(
          eventsData.map(async (event) => {
            const { count: participantsCount } = await supabase
              .from('event_participants')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', event.id);
            
            // Get club data (already joined in the query above)
            const clubData = event.clubs;
            
            // Get club member count
            const { count: memberCount } = await supabase
              .from('club_members')
              .select('*', { count: 'exact', head: true })
              .eq('club_id', clubData.id);
            
            return {
              id: event.id,
              title: event.title,
              description: event.description,
              date: event.date,
              location: event.location,
              imageUrl: event.image_url,
              category: event.category,
              status: event.status,
              participants: participantsCount || 0,
              maxParticipants: event.max_participants || undefined,
              organizer: {
                id: clubData.id,
                name: clubData.name,
                description: clubData.description,
                logoUrl: clubData.logo_url,
                category: clubData.category,
                memberCount: memberCount || 0,
                status: clubData.status,
                events: []
              }
            };
          })
        );
        
        setClubs(clubsWithCounts);
        setEvents(eventsWithDetails);
        
        // Set the featured event (first upcoming event)
        const upcomingEvents = eventsWithDetails.filter(event => event.status === 'upcoming');
        if (upcomingEvents.length > 0) {
          setFeaturedEvent(upcomingEvents[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error loading data',
          description: 'Failed to load content. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);

  return {
    events,
    clubs,
    featuredEvent,
    isLoading
  };
};
