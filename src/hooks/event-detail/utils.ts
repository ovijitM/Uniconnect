
import { Event } from '@/types';

export const formatEventData = (eventData: any, clubData: any | null): Event => {
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
  
  // Create a default or minimal organizer object if club data is missing
  const organizer = clubData ? {
    id: clubData.id,
    name: clubData.name,
    description: clubData.description,
    logoUrl: clubData.logo_url,
    category: clubData.category,
    university: clubData.university,
    memberCount: clubData.club_members?.[0]?.count || 0,
    events: []
  } : {
    id: eventData.club_id || 'unknown',
    name: 'Unknown Organizer',
    description: 'Information not available',
    logoUrl: null,
    category: 'Unknown',
    memberCount: 0,
    events: []
  };
  
  return {
    id: eventData.id,
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    location: eventData.location,
    imageUrl: eventData.image_url,
    organizer: organizer,
    category: eventData.category,
    status: eventData.status || 'upcoming',
    participants: participants,
    maxParticipants: eventData.max_participants || undefined,
    
    // Additional fields
    visibility: eventData.visibility || 'public',
    eventType: eventData.event_type,
    tagline: eventData.tagline,
    registrationDeadline: eventData.registration_deadline,
    onlinePlatform: eventData.online_platform,
    eligibility: eventData.eligibility,
    teamSize: eventData.team_size,
    registrationLink: eventData.registration_link,
    entryFee: eventData.entry_fee,
    theme: eventData.theme,
    subTracks: eventData.sub_tracks || [],
    prizePool: eventData.prize_pool,
    prizeCategories: eventData.prize_categories || [],
    additionalPerks: eventData.additional_perks || [],
    judgingCriteria: eventData.judging_criteria || [],
    judges: eventData.judges || [],
    schedule: eventData.schedule,
    deliverables: eventData.deliverables || [],
    submissionPlatform: eventData.submission_platform,
    mentors: eventData.mentors || [],
    sponsors: eventData.sponsors || [],
    contactEmail: eventData.contact_email,
    communityLink: eventData.community_link,
    eventWebsite: eventData.event_website,
    eventHashtag: eventData.event_hashtag
  };
};
