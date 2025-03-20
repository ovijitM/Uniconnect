
import { Database } from '@/integrations/supabase/types';

export interface Attendee {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  checked_in: boolean;
  checked_in_at: string | null;
  name: string;
  email: string;
  profile_image: string | null;
}

export interface EventParticipantWithProfile {
  created_at: string;
  event_id: string;
  user_id: string;
  checked_in: boolean | null;
  checked_in_at: string | null;
  profiles: {
    id: string;
    name: string;
    email: string;
    profile_image: string | null;
  } | null;
}
