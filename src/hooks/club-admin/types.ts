
export interface ClubFormData {
  name: string;
  description: string;
  category: string;
  university: string;
  universityId: string;
  tagline: string;
  establishedYear: string;
  affiliation: string;
  whyJoin: string;
  regularEvents: string;
  signatureEvents: string;
  communityEngagement: string;
  whoCanJoin: string;
  membershipFee: string;
  howToJoin: string;
  presidentName: string;
  presidentContact: string;
  executiveMembers: string;
  advisors: string;
  phoneNumber: string;
  website: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
  discordLink: string;
  logoUrl: string;
  documentUrl: string;
  documentName: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  eventType: string;
  maxParticipants: string;
  visibility: 'public' | 'university_only';
  clubId: string;
  imageUrl: string;
  tagline: string;
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
  schedule: string; // Adding the missing schedule property
  deliverables: string;
  submissionPlatform: string;
  mentors: string;
  sponsors: string;
  contactEmail: string;
  communityLink: string;
  eventWebsite: string;
  eventHashtag: string;
}
