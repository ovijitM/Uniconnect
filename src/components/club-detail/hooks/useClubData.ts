
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Club, Event } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { fetchClubById, fetchClubEvents, fetchRelatedClubs } from './api/clubApi';

export const useClubData = (providedClubId?: string) => {
  // Use provided clubId or get it from URL params as fallback
  const { clubId: urlClubId } = useParams<{ clubId: string }>();
  const clubId = providedClubId || urlClubId;
  
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [relatedClubs, setRelatedClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchClubData() {
      console.log("useClubData: Starting fetch for clubId:", clubId);
      
      // Better validation for clubId
      if (!clubId || clubId === 'undefined' || clubId === 'null') {
        console.error("No valid clubId provided");
        setIsLoading(false);
        setError(new Error("No club ID provided"));
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch club details
        const clubData = await fetchClubById(clubId);
        
        if (!clubData) {
          setError(new Error('Club not found'));
          return;
        }
        
        // Fetch events for this club
        const eventsData = await fetchClubEvents(clubId, clubData);
        
        // Fetch related clubs (same category)
        const relatedClubsData = await fetchRelatedClubs(clubId, clubData.category);
        
        setClub(clubData);
        setEvents(eventsData);
        setRelatedClubs(relatedClubsData);
      } catch (error) {
        console.error('Error in fetchClubData:', error);
        setError(error instanceof Error ? error : new Error(String(error)));
        toast({
          title: 'Error loading club',
          description: 'There was an error loading the club details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchClubData();
  }, [clubId, toast]);

  return {
    club,
    setClub,
    events,
    isLoading,
    relatedClubs,
    error
  };
};
