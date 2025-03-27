
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
              regularEvents: club.regular_events,
              signatureEvents: club.signature_events,
              communityEngagement: club.community_engagement,
              whoCanJoin: club.who_can_join,
              membershipFee: club.membership_fee,
              howToJoin: club.how_to_join,
              presidentChairName: club.president_chair_name,
              presidentChairContact: club.president_chair_contact,
              executiveMembers: club.executive_members,
              executiveMembersRoles: club.executive_members_roles,
              facultyAdvisors: club.faculty_advisors,
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
        
        // Fetch events - simplified query to ensure we get data
        console.log("Fetching events...");
        let eventsQuery = supabase
          .from('events')
          .select(`*, clubs:clubs!events_club_id_fkey (*)`);
        
        const { data: eventsData, error: eventsError } = await eventsQuery;
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          throw eventsError;
        }
        
        console.log(`Fetched ${eventsData?.length || 0} events`);
        console.log("Raw events data:", eventsData);
        
        // Process events with all required details
        const eventsWithDetails = (eventsData || []).map((event) => {
          if (!event || typeof event !== 'object') {
            console.error("Invalid event data:", event);
            return null;
          }
          
          // Ensure clubData is not empty and has valid properties
          // TypeScript is detecting that clubData might be an empty object
          const clubData = event.clubs || {};
          
          // Create a placeholder club with default values for safety
          const safeClubData: Partial<Club> = {
            id: '',
            name: 'Unknown Organizer',
            description: '',
            logoUrl: '',
            category: '',
            memberCount: 0,
            events: [],
            university: '',
          };
          
          // Only assign properties if they exist in clubData
          if (typeof clubData === 'object' && clubData !== null) {
            if ('id' in clubData) safeClubData.id = clubData.id;
            if ('name' in clubData) safeClubData.name = clubData.name;
            if ('description' in clubData) safeClubData.description = clubData.description;
            if ('logo_url' in clubData) safeClubData.logoUrl = clubData.logo_url;
            if ('category' in clubData) safeClubData.category = clubData.category;
            if ('university' in clubData) safeClubData.university = clubData.university;
            if ('established_year' in clubData) safeClubData.establishedYear = clubData.established_year;
            if ('affiliation' in clubData) safeClubData.affiliation = clubData.affiliation;
            if ('why_join' in clubData) safeClubData.whyJoin = clubData.why_join;
            if ('regular_events' in clubData) safeClubData.regularEvents = clubData.regular_events;
            if ('signature_events' in clubData) safeClubData.signatureEvents = clubData.signature_events;
            if ('community_engagement' in clubData) safeClubData.communityEngagement = clubData.community_engagement;
            if ('who_can_join' in clubData) safeClubData.whoCanJoin = clubData.who_can_join;
            if ('membership_fee' in clubData) safeClubData.membershipFee = clubData.membership_fee;
            if ('how_to_join' in clubData) safeClubData.howToJoin = clubData.how_to_join;
            if ('president_chair_name' in clubData) safeClubData.presidentChairName = clubData.president_chair_name;
            if ('president_chair_contact' in clubData) safeClubData.presidentChairContact = clubData.president_chair_contact;
            if ('executive_members' in clubData) safeClubData.executiveMembers = clubData.executive_members;
            if ('executive_members_roles' in clubData) safeClubData.executiveMembersRoles = clubData.executive_members_roles;
            if ('faculty_advisors' in clubData) safeClubData.facultyAdvisors = clubData.faculty_advisors;
            if ('primary_faculty_advisor' in clubData) safeClubData.primaryFacultyAdvisor = clubData.primary_faculty_advisor;
            if ('phone_number' in clubData) safeClubData.phoneNumber = clubData.phone_number;
            if ('website' in clubData) safeClubData.website = clubData.website;
            if ('facebook_link' in clubData) safeClubData.facebookLink = clubData.facebook_link;
            if ('instagram_link' in clubData) safeClubData.instagramLink = clubData.instagram_link;
            if ('twitter_link' in clubData) safeClubData.twitterLink = clubData.twitter_link;
            if ('discord_link' in clubData) safeClubData.discordLink = clubData.discord_link;
            if ('university_id' in clubData) safeClubData.universityId = clubData.university_id;
          } else {
            console.warn("Club data is missing or invalid for event:", event.title);
          }
          
          return {
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            imageUrl: event.image_url || '/placeholder.svg',
            category: event.category || 'General',
            status: (event.status || 'upcoming') as EventStatus,
            participants: 0, // Default value
            maxParticipants: event.max_participants,
            eventType: event.event_type || 'in-person',
            tagline: event.tagline,
            visibility: (event.visibility || 'public') as 'public' | 'university_only',
            organizer: safeClubData as Club
          } as Event;
        });
        
        // Filter out any null values from invalid event data
        const validEvents = eventsWithDetails.filter(event => event !== null) as Event[];
        
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
