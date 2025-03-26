
export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: string;
  clubId: string;
  imageUrl: string;
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
  schedule: string;
  deliverables: string;
  submissionPlatform: string;
  mentors: string;
  sponsors: string;
  contactEmail: string;
  communityLink: string;
  eventWebsite: string;
  eventHashtag: string;
  howToRegister: string;
  visibility: 'public' | 'university_only';
}

export interface ClubAdminDataType {
  adminClubs: any[];
  clubEvents: any[];
  clubMembers: any[];
  isLoading: boolean;
  selectedEventId: string | null;
  selectedEventTitle: string;
  errorMessage: string | null;
}

export interface EventCollaborator {
  id: string;
  name: string;
  logo_url?: string;
  university?: string;
}
