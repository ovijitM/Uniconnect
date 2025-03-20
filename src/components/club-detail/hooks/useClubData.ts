
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Club, Event } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useClubData = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [relatedClubs, setRelatedClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchClubData() {
      if (!clubId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch club details
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            status,
            rejection_reason,
            club_members(count)
          `)
          .eq('id', clubId)
          .single();
        
        if (clubError) {
          console.error('Error fetching club data:', clubError);
          throw clubError;
        }
        
        if (!clubData) {
          throw new Error('Club not found');
        }
        
        // Fetch events for this club
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            date,
            location,
            image_url,
            category,
            status,
            max_participants,
            event_participants(count)
          `)
          .eq('club_id', clubId)
          .order('date');
        
        if (eventsError) throw eventsError;
        
        // Fetch related clubs (same category)
        const { data: relatedData, error: relatedError } = await supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            status,
            club_members(count)
          `)
          .eq('category', clubData.category)
          .eq('status', 'approved')
          .neq('id', clubId)
          .limit(3);
        
        if (relatedError) {
          console.error('Error fetching related clubs:', relatedError);
        } else {
          const formattedRelatedClubs = relatedData.map(club => ({
            id: club.id,
            name: club.name,
            description: club.description,
            logoUrl: club.logo_url,
            category: club.category,
            status: club.status,
            memberCount: club.club_members[0]?.count || 0,
            events: []
          }));
          setRelatedClubs(formattedRelatedClubs);
        }
        
        // Format the club data
        const formattedClub: Club = {
          id: clubData.id,
          name: clubData.name,
          description: clubData.description,
          logoUrl: clubData.logo_url,
          category: clubData.category,
          status: clubData.status,
          rejectionReason: clubData.rejection_reason,
          memberCount: clubData.club_members[0]?.count || 0,
          events: []
        };
        
        // Format the events data
        const formattedEvents: Event[] = eventsData.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          imageUrl: event.image_url,
          organizer: formattedClub,
          category: event.category,
          status: event.status,
          participants: event.event_participants[0]?.count || 0,
          maxParticipants: event.max_participants || undefined
        }));
        
        setClub(formattedClub);
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching club data:', error);
        toast({
          title: 'Error fetching club data',
          description: 'Failed to load club details. Please try again later.',
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
    relatedClubs
  };
};
