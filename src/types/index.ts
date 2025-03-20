
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
  
  // New fields
  tagline?: string;
  establishedYear?: number;
  affiliation?: string;
  whyJoin?: string;
  regularEvents?: string[];
  signatureEvents?: string[];
  communityEngagement?: string;
  whoCanJoin?: string;
  membershipFee?: string;
  howToJoin?: string;
  presidentName?: string;
  presidentContact?: string;
  executiveMembers?: any; // Using any for JSONB type
  advisors?: string[];
  phoneNumber?: string;
  website?: string;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  discordLink?: string;
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
