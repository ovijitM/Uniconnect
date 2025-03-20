
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Club, Event } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useClubDetail = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [relatedClubs, setRelatedClubs] = useState<Club[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClubAdmin, setIsClubAdmin] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);
  
  useEffect(() => {
    async function checkClubAdmin() {
      if (!user || !clubId) return;
      
      const { data, error } = await supabase
        .from('club_admins')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking club admin status:', error);
      } else {
        setIsClubAdmin(!!data);
      }
    }
    
    checkClubAdmin();
  }, [user, clubId]);

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
        
        if (clubError) throw clubError;
        
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
        
        // Check if current user is a member
        if (user) {
          const { data: membershipData, error: membershipError } = await supabase
            .from('club_members')
            .select('*')
            .eq('club_id', clubId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          setIsMember(!!membershipData);
          
          if (membershipError) {
            console.error('Error checking membership:', membershipError);
          }
        }
        
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
  }, [clubId, toast, user]);

  const handleJoinClub = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to join clubs",
          variant: "destructive",
        });
        return;
      }
      
      if (!clubId) return;
      
      setIsJoining(true);
      
      // Check if the club is approved before joining
      if (club?.status !== 'approved') {
        toast({
          title: "Cannot join this club",
          description: "This club is not approved yet",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('club_members')
        .insert({
          club_id: clubId,
          user_id: user.id
        });
      
      if (error) {
        if (error.code === '23505') {
          // Duplicate key error - user is already a member
          toast({
            title: "Already a member",
            description: "You're already a member of this club",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        setIsMember(true);
        setClub(prev => prev ? { ...prev, memberCount: prev.memberCount + 1 } : null);
        
        toast({
          title: "Successfully joined!",
          description: `You're now a member of ${club?.name}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error joining club:', error);
      toast({
        title: "Failed to join club",
        description: "There was an error joining the club. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return {
    club,
    events,
    isLoading,
    isMember,
    isJoining,
    relatedClubs,
    isAdmin,
    isClubAdmin,
    handleJoinClub
  };
};
