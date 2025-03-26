
// Event form data type
export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  eventType: string;
  maxParticipants: string;
  imageUrl: string;
  clubId: string;
  tagline: string;
  registrationDeadline: string;
  onlinePlatform: string;
  eligibility: string;
  teamSize: string;
  registrationLink: string;
  entryFee: string;
  theme: string;
  subTracks: string[];
  prizePool: string;
  prizeCategories: string[];
  additionalPerks: string[];
  judgingCriteria: string[];
  judges: string[];
  schedule: Record<string, any>;
  deliverables: string[];
  submissionPlatform: string;
  mentors: string[];
  sponsors: string[];
  contactEmail: string;
  communityLink: string;
  eventWebsite: string;
  eventHashtag: string;
}

// Club form data type
export interface ClubFormData {
  name: string;
  description: string;
  category: string;
  university: string;
  logoUrl: string;
  tagline: string;
  establishedYear: string;
  affiliation: string;
  whyJoin: string;
  regularEvents: string[];
  signatureEvents: string[];
  communityEngagement: string;
  whoCanJoin: string;
  membershipFee: string;
  howToJoin: string;
  presidentName: string;
  presidentContact: string;
  executiveMembers: string;
  advisors: string[];
  phoneNumber: string;
  website: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
  discordLink: string;
  documentUrl: string;
  documentName: string;
}
