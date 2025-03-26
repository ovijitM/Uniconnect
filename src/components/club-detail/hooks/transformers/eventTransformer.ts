
import { Event, EventStatus, Club } from '@/types';

/**
 * Transforms raw event data from the database into the Event type
 */
export const transformEventData = (event: any, organizer: Club): Event => {
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
    organizer: organizer,
    category: event.category,
    status: (event.status || 'upcoming') as EventStatus,
    participants: participants,
    maxParticipants: event.max_participants || undefined,
    
    // Additional fields
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
};
