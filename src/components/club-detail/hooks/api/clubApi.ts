
import { supabase } from '@/integrations/supabase/client';
import { transformClubData } from '../transformers/clubTransformer';
import { transformEventData } from '../transformers/eventTransformer';
import { Club, Event } from '@/types';

/**
 * Fetches a club by ID with all its details
 */
export const fetchClubById = async (clubId: string): Promise<Club | null> => {
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
    throw clubError;
  }
  
  if (!clubData) {
    console.error("Club not found for ID:", clubId);
    return null;
  }
  
  return transformClubData(clubData);
};

/**
 * Fetches events for a specific club
 */
export const fetchClubEvents = async (clubId: string, organizer: Club): Promise<Event[]> => {
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
  }
  
  console.log(`Fetched ${eventsData?.length || 0} events for club`);
  
  if (!eventsData) {
    return [];
  }
  
  return eventsData.map(event => transformEventData(event, organizer));
};

/**
 * Fetches related clubs (same category)
 */
export const fetchRelatedClubs = async (clubId: string, category: string): Promise<Club[]> => {
  console.log("Fetching related clubs with category:", category);
  
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
    .eq('category', category)
    .eq('status', 'approved')
    .neq('id', clubId)
    .limit(3);
  
  if (relatedError) {
    console.error('Error fetching related clubs:', relatedError);
    return [];
  }
  
  console.log(`Fetched ${relatedData?.length || 0} related clubs`);
  
  return relatedData.map(club => transformClubData(club));
};
