
export interface Club {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  category: string;
  status?: string;
  rejectionReason?: string;
  memberCount: number;
  events: Event[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  organizer: Club;
  category: string;
  status: 'upcoming' | 'ongoing' | 'past';
  participants: number;
  maxParticipants?: number;
  
  // New fields
  eventType?: string;
  tagline?: string;
  registrationDeadline?: string;
  onlinePlatform?: string;
  eligibility?: string;
  teamSize?: string;
  registrationLink?: string;
  entryFee?: string;
  theme?: string;
  subTracks?: string[];
  prizePool?: string;
  prizeCategories?: string[];
  additionalPerks?: string[];
  judgingCriteria?: string[];
  judges?: string[];
  schedule?: any; // Changed from Record<string, any> to any to accommodate Json type
  deliverables?: string[];
  submissionPlatform?: string;
  mentors?: string[];
  sponsors?: string[];
  contactEmail?: string;
  communityLink?: string;
  eventWebsite?: string;
  eventHashtag?: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'past';
