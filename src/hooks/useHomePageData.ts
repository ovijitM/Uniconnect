
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
            
            // Create a safely typed club object with properties validated
            // Type assertion as Record<string, any> to allow property access checks
            const clubRecord = club as Record<string, any>;
            
            return {
              id: typeof clubRecord.id === 'string' ? clubRecord.id : '',
              name: typeof clubRecord.name === 'string' ? clubRecord.name : '',
              description: typeof clubRecord.description === 'string' ? clubRecord.description : '',
              logoUrl: typeof clubRecord.logo_url === 'string' ? clubRecord.logo_url : '',
              category: typeof clubRecord.category === 'string' ? clubRecord.category : '',
              memberCount: count || 0,
              status: typeof clubRecord.status === 'string' ? clubRecord.status : 'approved',
              events: [],
              university: typeof clubRecord.university === 'string' ? clubRecord.university : '',
              universityId: typeof clubRecord.university_id === 'string' ? clubRecord.university_id : undefined,
              tagline: typeof clubRecord.tagline === 'string' ? clubRecord.tagline : undefined,
              establishedYear: typeof clubRecord.established_year === 'number' ? clubRecord.established_year : undefined,
              affiliation: typeof clubRecord.affiliation === 'string' ? clubRecord.affiliation : undefined,
              whyJoin: typeof clubRecord.why_join === 'string' ? clubRecord.why_join : undefined,
              regularEvents: Array.isArray(clubRecord.regular_events) ? clubRecord.regular_events : [],
              signatureEvents: Array.isArray(clubRecord.signature_events) ? clubRecord.signature_events : [],
              communityEngagement: typeof clubRecord.community_engagement === 'string' ? clubRecord.community_engagement : undefined,
              whoCanJoin: typeof clubRecord.who_can_join === 'string' ? clubRecord.who_can_join : undefined,
              membershipFee: typeof clubRecord.membership_fee === 'string' ? clubRecord.membership_fee : undefined,
              howToJoin: typeof clubRecord.how_to_join === 'string' ? clubRecord.how_to_join : undefined,
              presidentChairName: typeof clubRecord.president_chair_name === 'string' ? clubRecord.president_chair_name : undefined,
              presidentChairContact: typeof clubRecord.president_chair_contact === 'string' ? clubRecord.president_chair_contact : undefined,
              executiveMembers: clubRecord.executive_members,
              executiveMembersRoles: clubRecord.executive_members_roles,
              facultyAdvisors: Array.isArray(clubRecord.faculty_advisors) ? clubRecord.faculty_advisors : [],
              primaryFacultyAdvisor: typeof clubRecord.primary_faculty_advisor === 'string' ? clubRecord.primary_faculty_advisor : undefined,
              phoneNumber: typeof clubRecord.phone_number === 'string' ? clubRecord.phone_number : undefined,
              website: typeof clubRecord.website === 'string' ? clubRecord.website : undefined,
              facebookLink: typeof clubRecord.facebook_link === 'string' ? clubRecord.facebook_link : undefined,
              instagramLink: typeof clubRecord.instagram_link === 'string' ? clubRecord.instagram_link : undefined,
              twitterLink: typeof clubRecord.twitter_link === 'string' ? clubRecord.twitter_link : undefined,
              discordLink: typeof clubRecord.discord_link === 'string' ? clubRecord.discord_link : undefined
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
          
          // Type assertion to provide safe access to properties
          const clubDataRecord = clubData as Record<string, any>;
          
          // Create a properly typed club object with safe defaults
          const safeClub: Club = {
            id: typeof clubDataRecord.id === 'string' ? clubDataRecord.id : '',
            name: typeof clubDataRecord.name === 'string' ? clubDataRecord.name : 'Unknown Organizer',
            description: typeof clubDataRecord.description === 'string' ? clubDataRecord.description : '',
            logoUrl: typeof clubDataRecord.logo_url === 'string' ? clubDataRecord.logo_url : '',
            category: typeof clubDataRecord.category === 'string' ? clubDataRecord.category : '',
            memberCount: 0,
            status: 'approved',
            events: [],
            university: typeof clubDataRecord.university === 'string' ? clubDataRecord.university : '',
            universityId: typeof clubDataRecord.university_id === 'string' ? clubDataRecord.university_id : undefined,
            tagline: typeof clubDataRecord.tagline === 'string' ? clubDataRecord.tagline : undefined,
            establishedYear: typeof clubDataRecord.established_year === 'number' ? clubDataRecord.established_year : undefined,
            affiliation: typeof clubDataRecord.affiliation === 'string' ? clubDataRecord.affiliation : undefined,
            whyJoin: typeof clubDataRecord.why_join === 'string' ? clubDataRecord.why_join : undefined,
            regularEvents: Array.isArray(clubDataRecord.regular_events) ? clubDataRecord.regular_events : [],
            signatureEvents: Array.isArray(clubDataRecord.signature_events) ? clubDataRecord.signature_events : [],
            communityEngagement: typeof clubDataRecord.community_engagement === 'string' ? clubDataRecord.community_engagement : undefined,
            whoCanJoin: typeof clubDataRecord.who_can_join === 'string' ? clubDataRecord.who_can_join : undefined,
            membershipFee: typeof clubDataRecord.membership_fee === 'string' ? clubDataRecord.membership_fee : undefined,
            howToJoin: typeof clubDataRecord.how_to_join === 'string' ? clubDataRecord.how_to_join : undefined,
            presidentChairName: typeof clubDataRecord.president_chair_name === 'string' ? clubDataRecord.president_chair_name : undefined,
            presidentChairContact: typeof clubDataRecord.president_chair_contact === 'string' ? clubDataRecord.president_chair_contact : undefined,
            executiveMembers: clubDataRecord.executive_members,
            executiveMembersRoles: clubDataRecord.executive_members_roles,
            facultyAdvisors: Array.isArray(clubDataRecord.faculty_advisors) ? clubDataRecord.faculty_advisors : [],
            primaryFacultyAdvisor: typeof clubDataRecord.primary_faculty_advisor === 'string' ? clubDataRecord.primary_faculty_advisor : undefined,
            phoneNumber: typeof clubDataRecord.phone_number === 'string' ? clubDataRecord.phone_number : undefined,
            website: typeof clubDataRecord.website === 'string' ? clubDataRecord.website : undefined,
            facebookLink: typeof clubDataRecord.facebook_link === 'string' ? clubDataRecord.facebook_link : undefined,
            instagramLink: typeof clubDataRecord.instagram_link === 'string' ? clubDataRecord.instagram_link : undefined,
            twitterLink: typeof clubDataRecord.twitter_link === 'string' ? clubDataRecord.twitter_link : undefined,
            discordLink: typeof clubDataRecord.discord_link === 'string' ? clubDataRecord.discord_link : undefined
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
