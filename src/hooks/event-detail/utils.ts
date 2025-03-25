
import { Event } from '@/types';

export const formatEventData = (eventData: any, clubData: any): Event => {
  return {
    id: eventData.id,
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    location: eventData.location,
    imageUrl: eventData.image_url,
    category: eventData.category,
    status: eventData.status,
    visibility: eventData.visibility,
    participants: eventData.event_participants[0]?.count || 0,
    maxParticipants: eventData.max_participants || undefined,
    eventType: eventData.event_type,
    tagline: eventData.tagline,
    registrationDeadline: eventData.registration_deadline,
    onlinePlatform: eventData.online_platform,
    eligibility: eventData.eligibility,
    teamSize: eventData.team_size,
    registrationLink: eventData.registration_link,
    entryFee: eventData.entry_fee,
    theme: eventData.theme,
    subTracks: eventData.sub_tracks,
    prizePool: eventData.prize_pool,
    prizeCategories: eventData.prize_categories,
    additionalPerks: eventData.additional_perks,
    judgingCriteria: eventData.judging_criteria,
    judges: eventData.judges,
    schedule: eventData.schedule,
    deliverables: eventData.deliverables,
    submissionPlatform: eventData.submission_platform,
    mentors: eventData.mentors,
    sponsors: eventData.sponsors,
    contactEmail: eventData.contact_email,
    communityLink: eventData.community_link,
    eventWebsite: eventData.event_website,
    eventHashtag: eventData.event_hashtag,
    organizer: {
      id: clubData.id,
      name: clubData.name,
      description: clubData.description,
      logoUrl: clubData.logo_url,
      category: clubData.category,
      university: clubData.university,
      memberCount: clubData.club_members?.[0]?.count || 0,
      events: []
    }
  };
};
