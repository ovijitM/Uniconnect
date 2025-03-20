
export interface ClubFormData {
  name: string;
  description: string;
  category: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: string;
  clubId: string;
  
  // New fields
  tagline: string;
  eventType: string;
  registrationDeadline: string;
  onlinePlatform: string;
  eligibility: string;
  teamSize: string;
  registrationLink: string;
  entryFee: string;
  theme: string;
  subTracks: string;
  prizePool: string;
  prizeCategories: string;
  additionalPerks: string;
  judgingCriteria: string;
  judges: string;
  deliverables: string;
  submissionPlatform: string;
  mentors: string;
  sponsors: string;
  contactEmail: string;
  communityLink: string;
  eventWebsite: string;
  eventHashtag: string;
}
