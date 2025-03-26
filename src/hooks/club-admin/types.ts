
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
  subTracks: string[] | string;
  prizePool: string;
  prizeCategories: string[] | string;
  additionalPerks: string[] | string;
  judgingCriteria: string[] | string;
  judges: string[] | string;
  schedule: Record<string, any> | string;
  deliverables: string[] | string;
  submissionPlatform: string;
  mentors: string[] | string;
  sponsors: string[] | string;
  contactEmail: string;
  communityLink: string;
  eventWebsite: string;
  eventHashtag: string;
  visibility: 'public' | 'university_only';
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
  regularEvents: string[] | string;
  signatureEvents: string[] | string;
  communityEngagement: string;
  whoCanJoin: string;
  membershipFee: string;
  howToJoin: string;
  presidentName: string;
  presidentContact: string;
  executiveMembers: string;
  advisors: string[] | string;
  phoneNumber: string;
  website: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
  discordLink: string;
  documentUrl: string;
  documentName: string;
  // Additional fields from other components
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMediaLinks: Record<string, string>;
  achievements: string;
  documents: Record<string, string>;
  missionStatement: string;
  visionStatement: string;
  values: string;
  foundingDate: string;
  clubType: string;
  studentCount: string;
  facultyAdvisor: string;
  budgetInfo: string;
  meetingInfo: string;
  additionalNotes: string;
}
