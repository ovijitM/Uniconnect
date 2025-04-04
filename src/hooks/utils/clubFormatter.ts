
import { Club } from '@/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Formats raw club data from Supabase into the application's Club type
 */
export const formatClubData = async (club: Record<string, any>): Promise<Club | null> => {
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
  return {
    id: typeof club.id === 'string' ? club.id : '',
    name: typeof club.name === 'string' ? club.name : '',
    description: typeof club.description === 'string' ? club.description : '',
    logoUrl: typeof club.logo_url === 'string' ? club.logo_url : '',
    category: typeof club.category === 'string' ? club.category : '',
    memberCount: count || 0,
    status: typeof club.status === 'string' ? club.status : 'approved',
    events: [],
    university: typeof club.university === 'string' ? club.university : '',
    universityId: typeof club.university_id === 'string' ? club.university_id : undefined,
    tagline: typeof club.tagline === 'string' ? club.tagline : undefined,
    establishedYear: typeof club.established_year === 'number' ? club.established_year : undefined,
    affiliation: typeof club.affiliation === 'string' ? club.affiliation : undefined,
    whyJoin: typeof club.why_join === 'string' ? club.why_join : undefined,
    regularEvents: Array.isArray(club.regular_events) ? club.regular_events : [],
    signatureEvents: Array.isArray(club.signature_events) ? club.signature_events : [],
    communityEngagement: typeof club.community_engagement === 'string' ? club.community_engagement : undefined,
    whoCanJoin: typeof club.who_can_join === 'string' ? club.who_can_join : undefined,
    membershipFee: typeof club.membership_fee === 'string' ? club.membership_fee : undefined,
    howToJoin: typeof club.how_to_join === 'string' ? club.how_to_join : undefined,
    presidentChairName: typeof club.president_chair_name === 'string' ? club.president_chair_name : undefined,
    presidentChairContact: typeof club.president_chair_contact === 'string' ? club.president_chair_contact : undefined,
    executiveMembers: club.executive_members,
    executiveMembersRoles: club.executive_members_roles,
    facultyAdvisors: Array.isArray(club.faculty_advisors) ? club.faculty_advisors : [],
    primaryFacultyAdvisor: typeof club.primary_faculty_advisor === 'string' ? club.primary_faculty_advisor : undefined,
    phoneNumber: typeof club.phone_number === 'string' ? club.phone_number : undefined,
    website: typeof club.website === 'string' ? club.website : undefined,
    facebookLink: typeof club.facebook_link === 'string' ? club.facebook_link : undefined,
    instagramLink: typeof club.instagram_link === 'string' ? club.instagram_link : undefined,
    twitterLink: typeof club.twitter_link === 'string' ? club.twitter_link : undefined,
    discordLink: typeof club.discord_link === 'string' ? club.discord_link : undefined
  };
};
