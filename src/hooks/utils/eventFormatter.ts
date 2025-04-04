
import { Event, Club, EventStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Formats club data for use in event objects
 */
export const formatEventClub = (clubData: Record<string, any>): Club => {
  return {
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
};

/**
 * Formats raw event data from Supabase into the application's Event type
 */
export const formatEventData = async (event: Record<string, any>, safeClub: Club): Promise<Event | null> => {
  if (!event || typeof event !== 'object') {
    console.error("Invalid event data:", event);
    return null;
  }
  
  // Get participants count
  const { count: participantsCount, error: countError } = await supabase
    .from('event_participants')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id);
    
  if (countError) {
    console.error(`Error getting participants count for event ${event.id}:`, countError);
  }
  
  // Create and return a valid Event object
  return {
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
  };
};
