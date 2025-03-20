
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
}
