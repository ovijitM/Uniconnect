
export interface Club {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  category: string;
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
}

export type EventStatus = 'upcoming' | 'ongoing' | 'past';
