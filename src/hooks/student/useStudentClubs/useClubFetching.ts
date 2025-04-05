
import { Dispatch, SetStateAction, useCallback } from 'react';
import { StudentClubsState } from '../types/studentClubTypes';
import { fetchAllClubs } from '../utils/fetchAllClubs';
import { useToast } from '@/hooks/use-toast';

export const useClubFetching = (
  userId: string | undefined,
  fetchJoinedClubsCallback: () => Promise<{ joinedClubs: any[], joinedClubIds: string[] }>,
  toast: ReturnType<typeof useToast>['toast'],
  setState: Dispatch<SetStateAction<StudentClubsState>>
) => {
  // Extracted function to fetch all clubs
  const fetchClubs = useCallback(async (userUniversity?: string | null) => {
    if (!userId) return;
    
    setState(prev => ({ ...prev, isLoadingClubs: true, error: null }));
    try {
      // First fetch joined clubs to update IDs - this is critical for showing correct membership status
      const joinedClubsResult = await fetchJoinedClubsCallback();
      
      // Fetch all available clubs
      const allClubs = await fetchAllClubs(userId, userUniversity, toast);
      
      // Use the freshly fetched joinedClubIds to filter availableClubs
      const joinedIds = joinedClubsResult?.joinedClubIds || [];
      
      setState(prev => ({
        ...prev,
        clubs: allClubs,
        joinedClubs: joinedClubsResult?.joinedClubs || [],
        joinedClubIds: joinedIds,
        isLoadingClubs: false
      }));
      
      console.log("fetchClubs completed with joined IDs:", joinedIds);
      return { clubs: allClubs, joinedClubs: joinedClubsResult?.joinedClubs || [], joinedClubIds: joinedIds };
    } catch (error: any) {
      console.error('Error fetching clubs:', error);
      setState(prev => ({ 
        ...prev, 
        isLoadingClubs: false,
        error: error?.message || 'Failed to fetch clubs'
      }));
      return null;
    }
  }, [userId, fetchJoinedClubsCallback, toast, setState]);
  
  return { fetchClubs };
};
