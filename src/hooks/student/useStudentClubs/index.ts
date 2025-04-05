
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useClubMemberships } from './useClubMemberships';
import { useClubFetching } from './useClubFetching';
import { StudentClubsState } from '../types/studentClubTypes';

export const useStudentClubs = (userId: string | undefined, onSuccess?: () => void) => {
  const [state, setState] = useState<StudentClubsState>({
    isLoadingClubs: false,
    clubs: [],
    joinedClubs: [],
    joinedClubIds: [],
    error: null
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Use extracted hooks for cleaner organization
  const { fetchJoinedClubsCallback } = useClubMemberships(userId, toast, setState);
  const { fetchClubs } = useClubFetching(userId, fetchJoinedClubsCallback, toast, setState);

  // Run fetchJoinedClubs initially to populate the joined clubs state
  useEffect(() => {
    if (userId) {
      console.log("Initial fetch of joined clubs for user:", userId);
      fetchJoinedClubsCallback();
    }
  }, [userId, fetchJoinedClubsCallback]);

  // Pass the handlers from the membership hook
  const { handleJoinClub, handleLeaveClub } = useClubMemberships(
    userId, 
    toast, 
    setState, 
    onSuccess
  );

  return {
    clubs: state.clubs,
    joinedClubs: state.joinedClubs,
    joinedClubIds: state.joinedClubIds,
    isLoadingClubs: state.isLoadingClubs,
    error: state.error,
    fetchClubs,
    joinClub: handleJoinClub,
    leaveClub: handleLeaveClub,
    refreshJoinedClubs: fetchJoinedClubsCallback
  };
};

export * from './useClubMemberships';
export * from './useClubFetching';
