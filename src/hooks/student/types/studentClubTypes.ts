
import { Club } from '@/types';

export interface StudentClubsState {
  isLoadingClubs: boolean;
  clubs: Club[];
  joinedClubs: Club[];
  joinedClubIds: string[];
}

export interface JoinClubOptions {
  onSuccess?: () => void;
}

export interface LeaveClubOptions {
  onSuccess?: () => void;
}
