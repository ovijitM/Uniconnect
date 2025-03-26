
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
        
        // Fetch club details with all the new fields
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
            club_members(count),
            tagline,
            established_year,
            affiliation,
            why_join,
            regular_events,
            signature_events,
            community_engagement,
            who_can_join,
            membership_fee,
            how_to_join,
            president_name,
            president_contact,
            executive_members,
            advisors,
            phone_number,
            website,
            facebook_link,
            instagram_link,
            twitter_link,
            discord_link
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
            event_participants(count),
            event_type,
            tagline,
            registration_deadline,
            online_platform,
            eligibility,
            team_size,
            registration_link,
            entry_fee,
            theme,
            sub_tracks,
            prize_pool,
            prize_categories,
            additional_perks,
            judging_criteria,
            judges,
            schedule,
            deliverables,
            submission_platform,
            mentors,
            sponsors,
            contact_email,
            community_link,
            event_website,
            event_hashtag
          `)
          .eq('club_id', clubId)
          .order('date');
        
        if (eventsError) throw eventsError;
        
        // Fetch related clubs (same category) with all fields
        const { data: relatedData, error: relatedError } = await supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            status,
            club_members(count),
            tagline,
            established_year
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
            events: [],
            tagline: club.tagline,
            establishedYear: club.established_year
          }));
          setRelatedClubs(formattedRelatedClubs);
        }
        
        // Format the club data with all new fields
        const formattedClub: Club = {
          id: clubData.id,
          name: clubData.name,
          description: clubData.description,
          logoUrl: clubData.logo_url,
          category: clubData.category,
          status: clubData.status,
          rejectionReason: clubData.rejection_reason,
          memberCount: clubData.club_members[0]?.count || 0,
          events: [],
          
          // New fields
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
        };
        
        // Format the events data with all the new fields
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
          maxParticipants: event.max_participants || undefined,
          
          // New fields
          eventType: event.event_type,
          tagline: event.tagline,
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
          eventHashtag: event.event_hashtag
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
