
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, Club } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatClubData } from './utils/clubFormatter';
import { formatEventData, formatEventClub } from './utils/eventFormatter';
import { fetchUserUniversity, createVisibilityFilter } from './utils/dataFetching';

export const useHomePageData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [featuredClubs, setFeaturedClubs] = useState<Club[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Memoize the fetchData function to avoid recreating it on every render
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Starting to fetch home page data");
      
      // Fetch user university if logged in
      const userUniversity = user ? await fetchUserUniversity(user.id) : null;
      
      // Fetch approved clubs
      console.log("Fetching clubs...");
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*')
        .eq('status', 'approved');
      
      if (clubsError) {
        console.error("Error fetching clubs:", clubsError);
        throw clubsError;
      }
      
      console.log(`Fetched ${clubsData?.length || 0} clubs`);
      
      // Process clubs with Promise.all for parallel processing
      const clubPromises = (clubsData || []).map(club => formatClubData(club as Record<string, any>));
      const formattedClubs = await Promise.all(clubPromises);
      const validClubs = formattedClubs.filter(club => club !== null) as Club[];
      
      // Fetch events with proper club details and visibility filtering
      console.log("Fetching events...");
      let eventsQuery = supabase
        .from('events')
        .select('*, clubs:club_id(*)');
      
      // Apply visibility filtering based on user university
      const visibilityFilter = createVisibilityFilter(userUniversity);
      if (visibilityFilter.type === 'or') {
        eventsQuery = eventsQuery.or(visibilityFilter.filter);
      } else {
        eventsQuery = eventsQuery.eq('visibility', visibilityFilter.filter);
      }
      
      const { data: eventsData, error: eventsError } = await eventsQuery;
      
      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        throw eventsError;
      }
      
      console.log(`Fetched ${eventsData?.length || 0} events`);
      console.log("Raw events data:", eventsData);
      
      // Process events
      const eventPromises = (eventsData || []).map(async (event) => {
        const clubData = event.clubs || {};
        const safeClub = formatEventClub(clubData as Record<string, any>);
        return formatEventData(event as Record<string, any>, safeClub);
      });
      
      const formattedEvents = await Promise.all(eventPromises);
      const validEvents = formattedEvents.filter(event => event !== null) as Event[];
      
      console.log("Processed events:", validEvents);
      
      // Update state with processed data
      setClubs(validClubs);
      setEvents(validEvents);
      
      // Extract unique categories using Set for efficiency
      const uniqueCategories = [...new Set(validClubs.map(club => club.category))];
      setCategories(uniqueCategories);
      
      // Set featured clubs (first 4 clubs)
      setFeaturedClubs(validClubs.slice(0, 4));
      
      // Set upcoming events 
      const upcoming = validEvents.filter(event => event.status === 'upcoming');
      setUpcomingEvents(upcoming);
      
      // Set featured event (first upcoming event)
      if (upcoming.length > 0) {
        setFeaturedEvent(upcoming[0]);
        console.log("Set featured event:", upcoming[0].title);
      } else {
        console.log("No upcoming events found for featured event");
      }
    } catch (error) {
      console.error('Error fetching home page data:', error);
      toast({
        title: 'Error loading data',
        description: 'Failed to load content. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  // Run the data fetching on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Return memoized data to prevent unnecessary re-renders
  return useMemo(() => ({
    events,
    clubs,
    featuredEvent,
    featuredClubs,
    categories,
    upcomingEvents,
    isLoading
  }), [
    events,
    clubs,
    featuredEvent,
    featuredClubs,
    categories,
    upcomingEvents,
    isLoading
  ]);
};
