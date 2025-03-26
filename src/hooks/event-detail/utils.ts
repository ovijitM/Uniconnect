
import { Event } from '@/types';

export const formatEventData = (eventData: any, clubData: any | null): Event => {
  if (!eventData) {
    console.error('No event data provided to formatEventData');
    throw new Error('No event data provided');
  }

  // Extract participant count from event_participants
  let participants = 0;
  if (eventData.event_participants) {
    if (Array.isArray(eventData.event_participants) && eventData.event_participants.length > 0) {
      const countData = eventData.event_participants[0];
      
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
    }
  }
  
  // Ensure participants is a valid number
  participants = isNaN(participants) ? 0 : participants;
  
  // Create a default or minimal organizer object if club data is missing
  const organizer = clubData ? {
    id: clubData.id,
    name: clubData.name || 'Unknown Organization',
    description: clubData.description || 'No description available',
    logoUrl: clubData.logo_url,
    category: clubData.category || 'General',
    university: clubData.university || 'Unknown University',
    memberCount: clubData.club_members?.[0]?.count || 0,
    events: []
  } : {
    id: eventData.club_id || 'unknown',
    name: 'Unknown Organizer',
    description: 'Information not available',
    logoUrl: null,
    category: 'Unknown',
    university: 'Unknown University',
    memberCount: 0,
    events: []
  };
  
  // Log the event transformation
  console.log(`Formatting event: ${eventData.id} (${eventData.title}) with organizer: ${organizer.name}`);
  
  return {
    id: eventData.id || '',
    title: eventData.title || 'Untitled Event',
    description: eventData.description || 'No description provided',
    date: eventData.date || new Date().toISOString(),
    location: eventData.location || 'Location not specified',
    imageUrl: eventData.image_url || null,
    organizer: organizer,
    category: eventData.category || 'General',
    status: eventData.status || 'upcoming',
    participants: participants,
    maxParticipants: eventData.max_participants || undefined,
    
    // Additional fields with fallbacks
    visibility: eventData.visibility || 'public',
    eventType: eventData.event_type || 'in-person',
    tagline: eventData.tagline || '',
    registrationDeadline: eventData.registration_deadline || null,
    onlinePlatform: eventData.online_platform || null,
    eligibility: eventData.eligibility || null,
    teamSize: eventData.team_size || null,
    registrationLink: eventData.registration_link || null,
    entryFee: eventData.entry_fee || 'Free',
    theme: eventData.theme || null,
    subTracks: eventData.sub_tracks || [],
    prizePool: eventData.prize_pool || null,
    prizeCategories: eventData.prize_categories || [],
    additionalPerks: eventData.additional_perks || [],
    judgingCriteria: eventData.judging_criteria || [],
    judges: eventData.judges || [],
    schedule: eventData.schedule || null,
    deliverables: eventData.deliverables || [],
    submissionPlatform: eventData.submission_platform || null,
    mentors: eventData.mentors || [],
    sponsors: eventData.sponsors || [],
    contactEmail: eventData.contact_email || null,
    communityLink: eventData.community_link || null,
    eventWebsite: eventData.event_website || null,
    eventHashtag: eventData.event_hashtag || null,
    collaborators: [] // This will be populated later if needed
  };
};
