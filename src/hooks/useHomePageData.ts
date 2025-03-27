
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
          
          const clubData = event.clubs || {};
          
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
            organizer: {
              id: clubData.id || '',
              name: clubData.name || 'Unknown Organizer',
              description: clubData.description || '',
              logoUrl: clubData.logo_url || '',
              category: clubData.category || '',
              memberCount: 0,
              events: [],
              university: clubData.university || '',
              establishedYear: clubData.established_year,
              affiliation: clubData.affiliation,
              whyJoin: clubData.why_join,
              regularEvents: clubData.regular_events,
              signatureEvents: clubData.signature_events,
              communityEngagement: clubData.community_engagement,
              whoCanJoin: clubData.who_can_join,
              membershipFee: clubData.membership_fee,
              howToJoin: clubData.how_to_join,
              presidentChairName: clubData.president_chair_name,
              presidentChairContact: clubData.president_chair_contact,
              executiveMembers: clubData.executive_members,
              executiveMembersRoles: clubData.executive_members_roles,
              facultyAdvisors: clubData.faculty_advisors,
              primaryFacultyAdvisor: clubData.primary_faculty_advisor,
              phoneNumber: clubData.phone_number,
              website: clubData.website,
              facebookLink: clubData.facebook_link,
              instagramLink: clubData.instagram_link,
              twitterLink: clubData.twitter_link,
              discordLink: clubData.discord_link,
              universityId: clubData.university_id
            }
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
