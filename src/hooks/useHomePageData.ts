
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, Club, EventStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useHomePageData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        console.log("Starting to fetch home page data");
        
        let userUniversity = null;
        if (user) {
          console.log("Fetching university for user:", user.id);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('university')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            userUniversity = profileData.university;
            console.log("Found user university:", userUniversity);
          }
        }
        
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
        
        // Prepare clubs with member counts
        const clubsWithCounts = await Promise.all(
          (clubsData || []).map(async (club) => {
            // TypeScript guard to ensure club is not empty
            if (!club || typeof club !== 'object') {
              console.error("Invalid club data:", club);
              return null;
            }
            
            // Get member count for each club
            const { count, error: countError } = await supabase
              .from('club_members')
              .select('*', { count: 'exact', head: true })
              .eq('club_id', club.id);
            
            if (countError) {
              console.error(`Error getting member count for club ${club.id}:`, countError);
            }
            
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
              regularEvents: Array.isArray(club.regular_events) ? club.regular_events : [],
              signatureEvents: Array.isArray(club.signature_events) ? club.signature_events : [],
              communityEngagement: club.community_engagement,
              whoCanJoin: club.who_can_join,
              membershipFee: club.membership_fee,
              howToJoin: club.how_to_join,
              presidentChairName: club.president_chair_name,
              presidentChairContact: club.president_chair_contact,
              executiveMembers: club.executive_members,
              executiveMembersRoles: club.executive_members_roles,
              facultyAdvisors: Array.isArray(club.faculty_advisors) ? club.faculty_advisors : [],
              primaryFacultyAdvisor: club.primary_faculty_advisor,
              phoneNumber: club.phone_number,
              website: club.website,
              facebookLink: club.facebook_link,
              instagramLink: club.instagram_link,
              twitterLink: club.twitter_link,
              discordLink: club.discord_link,
              university: club.university,
              universityId: club.university_id
            } as Club;
          })
        );
        
        // Filter out any null values that might have been created due to invalid club data
        const validClubs = clubsWithCounts.filter(club => club !== null) as Club[];
        
        // Fetch events with proper club details
        console.log("Fetching events...");
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*, clubs:club_id(*)');
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          throw eventsError;
        }
        
        console.log(`Fetched ${eventsData?.length || 0} events`);
        console.log("Raw events data:", eventsData);
        
        // Process events
        const validEvents: Event[] = [];
        
        for (const event of eventsData || []) {
          if (!event || typeof event !== 'object') {
            console.error("Invalid event data:", event);
            continue;
          }
          
          // Get the associated club data
          const clubData = event.clubs || {};
          
          // Create a properly typed club object with safe defaults
          const safeClub: Club = {
            id: typeof clubData.id === 'string' ? clubData.id : '',
            name: typeof clubData.name === 'string' ? clubData.name : 'Unknown Organizer',
            description: typeof clubData.description === 'string' ? clubData.description : '',
            logoUrl: typeof clubData.logo_url === 'string' ? clubData.logo_url : '',
            category: typeof clubData.category === 'string' ? clubData.category : '',
            memberCount: 0,
            status: 'approved',
            events: [],
            university: typeof clubData.university === 'string' ? clubData.university : '',
            universityId: typeof clubData.university_id === 'string' ? clubData.university_id : undefined,
            tagline: typeof clubData.tagline === 'string' ? clubData.tagline : undefined,
            establishedYear: typeof clubData.established_year === 'number' ? clubData.established_year : undefined,
            affiliation: typeof clubData.affiliation === 'string' ? clubData.affiliation : undefined,
            whyJoin: typeof clubData.why_join === 'string' ? clubData.why_join : undefined,
            regularEvents: Array.isArray(clubData.regular_events) ? clubData.regular_events : [],
            signatureEvents: Array.isArray(clubData.signature_events) ? clubData.signature_events : [],
            communityEngagement: typeof clubData.community_engagement === 'string' ? clubData.community_engagement : undefined,
            whoCanJoin: typeof clubData.who_can_join === 'string' ? clubData.who_can_join : undefined,
            membershipFee: typeof clubData.membership_fee === 'string' ? clubData.membership_fee : undefined,
            howToJoin: typeof clubData.how_to_join === 'string' ? clubData.how_to_join : undefined,
            presidentChairName: typeof clubData.president_chair_name === 'string' ? clubData.president_chair_name : undefined,
            presidentChairContact: typeof clubData.president_chair_contact === 'string' ? clubData.president_chair_contact : undefined,
            executiveMembers: clubData.executive_members,
            executiveMembersRoles: clubData.executive_members_roles,
            facultyAdvisors: Array.isArray(clubData.faculty_advisors) ? clubData.faculty_advisors : [],
            primaryFacultyAdvisor: typeof clubData.primary_faculty_advisor === 'string' ? clubData.primary_faculty_advisor : undefined,
            phoneNumber: typeof clubData.phone_number === 'string' ? clubData.phone_number : undefined,
            website: typeof clubData.website === 'string' ? clubData.website : undefined,
            facebookLink: typeof clubData.facebook_link === 'string' ? clubData.facebook_link : undefined,
            instagramLink: typeof clubData.instagram_link === 'string' ? clubData.instagram_link : undefined,
            twitterLink: typeof clubData.twitter_link === 'string' ? clubData.twitter_link : undefined,
            discordLink: typeof clubData.discord_link === 'string' ? clubData.discord_link : undefined
          };
          
          // Get participants count
          const { count: participantsCount, error: countError } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);
            
          if (countError) {
            console.error(`Error getting participants count for event ${event.id}:`, countError);
          }
          
          // Create a valid Event object
          validEvents.push({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            imageUrl: event.image_url || '/placeholder.svg',
            category: event.category || 'General',
            status: (event.status || 'upcoming') as EventStatus,
            participants: participantsCount || 0,
            maxParticipants: event.max_participants,
            eventType: event.event_type || 'in-person',
            tagline: event.tagline,
            visibility: (event.visibility || 'public') as 'public' | 'university_only',
            organizer: safeClub
          });
        }
        
        console.log("Processed events:", validEvents);
        
        setClubs(validClubs);
        setEvents(validEvents);
        
        // Set featured event (first upcoming event)
        const upcomingEvents = validEvents.filter(event => event.status === 'upcoming');
        if (upcomingEvents.length > 0) {
          setFeaturedEvent(upcomingEvents[0]);
          console.log("Set featured event:", upcomingEvents[0].title);
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
