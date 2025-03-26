import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, Club, EventStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthFallback } from './useAuthFallback';

export const useHomePageData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.warn('AuthContext not available, using fallback');
    authData = useAuthFallback();
  }
  
  const { user } = authData;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        let userUniversity = null;
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('university')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            userUniversity = profileData.university;
          }
        }
        
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('*')
          .eq('status', 'approved');
        
        if (clubsError) throw clubsError;
        
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
              events: [],
              tagline: club.tagline,
              establishedYear: club.established_year,
              affiliation: club.affiliation,
              whyJoin: club.why_join,
              regularEvents: club.regular_events,
              signatureEvents: club.signature_events,
              communityEngagement: club.community_engagement,
              whoCanJoin: club.who_can_join,
              membershipFee: club.membership_fee,
              howToJoin: club.how_to_join,
              presidentName: club.president_name,
              presidentContact: club.president_contact,
              executiveMembers: club.executive_members,
              advisors: club.advisors,
              phoneNumber: club.phone_number,
              website: club.website,
              facebookLink: club.facebook_link,
              instagramLink: club.instagram_link,
              twitterLink: club.twitter_link,
              discordLink: club.discord_link
            };
          })
        );
        
        let eventsQuery = supabase
          .from('events')
          .select('*, clubs!events_club_id_fkey(*)');
        
        if (user && userUniversity) {
          eventsQuery = eventsQuery
            .eq('clubs.status', 'approved')
            .or(`visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq.${JSON.stringify(userUniversity)})`);
        } else {
          eventsQuery = eventsQuery
            .eq('clubs.status', 'approved')
            .eq('visibility', 'public');
        }
        
        const { data: eventsData, error: eventsError } = await eventsQuery.order('date');
        
        if (eventsError) throw eventsError;
        
        const eventsWithDetails = await Promise.all(
          eventsData.map(async (event) => {
            const { count: participantsCount } = await supabase
              .from('event_participants')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', event.id);
            
            const clubData = event.clubs;
            
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
              status: (event.status || 'upcoming') as EventStatus,
              participants: participantsCount || 0,
              maxParticipants: event.max_participants || undefined,
              eventType: event.event_type,
              tagline: event.tagline,
              visibility: (event.visibility || 'public') as 'public' | 'university_only',
              registrationDeadline: event.registration_deadline,
              onlinePlatform: event.online_platform,
              eligibility: event.eligibility,
              teamSize: event.team_size,
              registrationLink: event.registration_link,
              entryFee: event.entry_fee,
              theme: event.theme,
              subTracks: event.sub_tracks,
              prizePool: event.prize_pool,
              prizeCategories: event.prize_categories,
              additionalPerks: event.additional_perks,
              judgingCriteria: event.judging_criteria,
              judges: event.judges,
              schedule: event.schedule,
              deliverables: event.deliverables,
              submissionPlatform: event.submission_platform,
              mentors: event.mentors,
              sponsors: event.sponsors,
              contactEmail: event.contact_email,
              communityLink: event.community_link,
              eventWebsite: event.event_website,
              eventHashtag: event.event_hashtag,
              organizer: {
                id: clubData.id,
                name: clubData.name,
                description: clubData.description,
                logoUrl: clubData.logo_url,
                category: clubData.category,
                memberCount: memberCount || 0,
                status: clubData.status,
                events: [],
                tagline: clubData.tagline,
                establishedYear: clubData.established_year,
                affiliation: clubData.affiliation,
                whyJoin: clubData.why_join,
                regularEvents: clubData.regular_events,
                signatureEvents: clubData.signature_events,
                communityEngagement: clubData.community_engagement,
                whoCanJoin: clubData.who_can_join,
                membershipFee: clubData.membership_fee,
                howToJoin: clubData.how_to_join,
                presidentName: clubData.president_name,
                presidentContact: clubData.president_contact,
                executiveMembers: clubData.executive_members,
                advisors: clubData.advisors,
                phoneNumber: clubData.phone_number,
                website: clubData.website,
                facebookLink: clubData.facebook_link,
                instagramLink: clubData.instagram_link,
                twitterLink: clubData.twitter_link,
                discordLink: clubData.discord_link
              }
            };
          })
        );
        
        setClubs(clubsWithCounts);
        setEvents(eventsWithDetails);
        
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
  }, [toast, user]);

  return {
    events,
    clubs,
    featuredEvent,
    isLoading
  };
};
