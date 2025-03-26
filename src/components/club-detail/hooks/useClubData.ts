
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Club, Event, EventStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useClubData = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [relatedClubs, setRelatedClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchClubData() {
      console.log("useClubData: Starting fetch for clubId:", clubId);
      if (!clubId) {
        console.error("No clubId provided");
        setIsLoading(false);
        setError(new Error("No club ID provided"));
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch club details with all the new fields
        console.log("Fetching club details for clubId:", clubId);
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
            president_chair_name,
            president_chair_contact,
            executive_members,
            executive_members_roles,
            faculty_advisors,
            primary_faculty_advisor,
            phone_number,
            website,
            facebook_link,
            instagram_link,
            twitter_link,
            discord_link,
            university
          `)
          .eq('id', clubId)
          .maybeSingle();
        
        if (clubError) {
          console.error('Error fetching club data:', clubError);
          setError(clubError);
          throw clubError;
        }
        
        console.log("Club data fetched:", clubData);
        
        if (!clubData) {
          console.error("Club not found");
          setError(new Error('Club not found'));
          throw new Error('Club not found');
        }
        
        // Fetch events for this club
        console.log("Fetching events for clubId:", clubId);
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
            visibility,
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
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          throw eventsError;
        }
        
        console.log(`Fetched ${eventsData?.length || 0} events for club`);
        
        // Fetch related clubs (same category)
        console.log("Fetching related clubs with category:", clubData.category);
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
            established_year,
            university
          `)
          .eq('category', clubData.category)
          .eq('status', 'approved')
          .neq('id', clubId)
          .limit(3);
        
        if (relatedError) {
          console.error('Error fetching related clubs:', relatedError);
        } else {
          console.log(`Fetched ${relatedData?.length || 0} related clubs`);
          const formattedRelatedClubs = relatedData.map(club => {
            let memberCount = 0;
            if (club.club_members && Array.isArray(club.club_members) && club.club_members.length > 0) {
              const countData = club.club_members[0];
              
              // Handle different count formats
              if (typeof countData === 'number') {
                memberCount = countData;
              } else if (typeof countData === 'string') {
                memberCount = parseInt(countData, 10) || 0;
              } else if (countData && typeof countData === 'object') {
                const rawCount = countData.count;
                if (typeof rawCount === 'number') {
                  memberCount = rawCount;
                } else if (typeof rawCount === 'string') {
                  memberCount = parseInt(rawCount, 10) || 0;
                }
              }
              
              memberCount = isNaN(memberCount) ? 0 : memberCount;
            }
            
            return {
              id: club.id,
              name: club.name,
              description: club.description,
              logoUrl: club.logo_url,
              category: club.category,
              status: club.status,
              memberCount: memberCount,
              events: [],
              tagline: club.tagline,
              establishedYear: club.established_year,
              university: club.university
            };
          });
          setRelatedClubs(formattedRelatedClubs);
        }
        
        // Process club member count
        let memberCount = 0;
        if (clubData.club_members && Array.isArray(clubData.club_members) && clubData.club_members.length > 0) {
          const countData = clubData.club_members[0];
          
          // Handle different count formats
          if (typeof countData === 'number') {
            memberCount = countData;
          } else if (typeof countData === 'string') {
            memberCount = parseInt(countData, 10) || 0;
          } else if (countData && typeof countData === 'object') {
            const rawCount = countData.count;
            if (typeof rawCount === 'number') {
              memberCount = rawCount;
            } else if (typeof rawCount === 'string') {
              memberCount = parseInt(rawCount, 10) || 0;
            }
          }
          
          memberCount = isNaN(memberCount) ? 0 : memberCount;
        }
        
        console.log("Processing club data with member count:", memberCount);
        
        // Transform club data to use the new column structure
        const transformClubData = (clubData: any): Club => {
          return {
            id: clubData.id,
            name: clubData.name,
            description: clubData.description,
            logoUrl: clubData.logo_url,
            category: clubData.category,
            status: clubData.status,
            rejectionReason: clubData.rejection_reason,
            memberCount: memberCount,
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
            phoneNumber: clubData.phone_number,
            website: clubData.website,
            facebookLink: clubData.facebook_link,
            instagramLink: clubData.instagram_link,
            twitterLink: clubData.twitter_link,
            discordLink: clubData.discord_link,
            university: clubData.university,
            
            // Leadership fields using the consolidated columns
            presidentChairName: clubData.president_chair_name || '',
            presidentChairContact: clubData.president_chair_contact || '',
            executiveMembers: clubData.executive_members || {},
            executiveMembersRoles: clubData.executive_members_roles || {},
            facultyAdvisors: clubData.faculty_advisors || [],
            primaryFacultyAdvisor: clubData.primary_faculty_advisor || ''
          };
        };
        
        const formattedClub = transformClubData(clubData);
        
        // Format the events data with all the new fields and ensure status is of correct type
        const formattedEvents: Event[] = eventsData.map(event => {
          let participants = 0;
          if (event.event_participants && Array.isArray(event.event_participants) && event.event_participants.length > 0) {
            const countData = event.event_participants[0];
            
            // Handle different count formats
            if (typeof countData === 'number') {
              participants = countData;
            } else if (typeof countData === 'string') {
              participants = parseInt(countData, 10) || 0;
            } else if (countData && typeof countData === 'object') {
              const rawCount = countData.count;
              if (typeof rawCount === 'number') {
                participants = rawCount;
              } else if (typeof rawCount === 'string') {
                participants = parseInt(rawCount, 10) || 0;
              }
            }
            
            participants = isNaN(participants) ? 0 : participants;
          }
          
          return {
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            imageUrl: event.image_url,
            organizer: formattedClub,
            category: event.category,
            status: (event.status || 'upcoming') as EventStatus, // Cast to EventStatus
            participants: participants,
            maxParticipants: event.max_participants || undefined,
            
            // New fields
            visibility: (event.visibility || 'public') as 'public' | 'university_only',
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
          };
        });
        
        console.log(`Setting ${formattedEvents.length} formatted events`);
        
        setClub(formattedClub);
        setEvents(formattedEvents);
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
