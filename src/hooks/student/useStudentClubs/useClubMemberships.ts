
import { Dispatch, SetStateAction, useCallback } from 'react';
import { StudentClubsState } from '../types/studentClubTypes';
import { joinClub, leaveClub } from '../utils/clubMembershipActions';
import { fetchJoinedClubs } from '../utils/fetchJoinedClubs';
import { useToast } from '@/hooks/use-toast';

export const useClubMemberships = (
  userId: string | undefined, 
  toast: ReturnType<typeof useToast>['toast'],
  setState: Dispatch<SetStateAction<StudentClubsState>>, 
  onSuccess?: () => void
) => {
  // Extracted function to fetch joined clubs
  const fetchJoinedClubsCallback = useCallback(async () => {
    if (!userId) return { joinedClubs: [], joinedClubIds: [] };
    
    try {
      console.log("Fetching joined clubs for user:", userId);
      setState(prev => ({ ...prev, isLoadingClubs: true }));
      
      const result = await fetchJoinedClubs(userId, toast);
      console.log("Fetched joined clubs:", result.joinedClubs.length);
      console.log("Fetched joined club IDs:", result.joinedClubIds);
      
      setState(prev => ({
        ...prev,
        joinedClubs: result.joinedClubs,
        joinedClubIds: result.joinedClubIds,
        isLoadingClubs: false
      }));
      
      return result;
    } catch (error: any) {
      console.error('Error fetching joined clubs:', error);
      setState(prev => ({
        ...prev,
        error: error?.message || 'Failed to fetch joined clubs',
        isLoadingClubs: false
      }));
      return { joinedClubs: [], joinedClubIds: [] };
    }
  }, [userId, toast, setState]);

  // Extracted function to handle joining a club
  const handleJoinClub = async (clubId: string) => {
    try {
      console.log(`Starting join club process for club ${clubId}`);
      
      // Optimistically update UI
      const clubToJoin = setState(prev => {
        const clubToJoin = prev.clubs.find(club => club.id === clubId);
        return {
          ...prev,
          joinedClubIds: [...prev.joinedClubIds, clubId],
          joinedClubs: clubToJoin ? [...prev.joinedClubs, clubToJoin] : prev.joinedClubs
        };
      });
      
      // Define a callback for when the join is successful
      const handleJoinSuccess = async () => {
        console.log(`Join club success callback triggered for club ${clubId}`);
        if (onSuccess) onSuccess();
        
        // Force refresh the joined clubs immediately
        await fetchJoinedClubsCallback();
      };
      
      const success = await joinClub(userId!, clubId, toast, { 
        onSuccess: handleJoinSuccess,
        onError: (error) => {
          console.error("Error in join club callback:", error);
          // Revert optimistic update in case of error
          setState(prev => ({
            ...prev,
            joinedClubIds: prev.joinedClubIds.filter(id => id !== clubId),
            joinedClubs: prev.joinedClubs.filter(club => club.id !== clubId)
          }));
        }
      });
      
      if (!success) {
        // If join failed, revert the optimistic update
        setState(prev => ({
          ...prev,
          joinedClubIds: prev.joinedClubIds.filter(id => id !== clubId),
          joinedClubs: prev.joinedClubs.filter(club => club.id !== clubId)
        }));
      }
    } catch (error: any) {
      console.error('Error joining club:', error);
      
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        joinedClubIds: prev.joinedClubIds.filter(id => id !== clubId),
        joinedClubs: prev.joinedClubs.filter(club => club.id !== clubId),
        error: error?.message || 'Failed to join club'
      }));
      
      throw error; // Re-throw to allow the component to handle the error
    }
  };

  // Extracted function to handle leaving a club
  const handleLeaveClub = async (clubId: string) => {
    try {
      console.log(`Starting leave club process for club ${clubId}`);
      
      // Optimistically update UI
      setState(prev => ({
        ...prev,
        joinedClubs: prev.joinedClubs.filter(club => club.id !== clubId),
        joinedClubIds: prev.joinedClubIds.filter(id => id !== clubId)
      }));
      
      // Define a callback for when the leave is successful
      const handleLeaveSuccess = async () => {
        console.log(`Leave club success callback triggered for club ${clubId}`);
        if (onSuccess) onSuccess();
        
        // Force refresh the joined clubs immediately
        await fetchJoinedClubsCallback();
      };
      
      const success = await leaveClub(userId, clubId, toast, { 
        onSuccess: handleLeaveSuccess,
        onError: (error) => {
          console.error("Error in leave club callback:", error);
          // Refresh data on error to get accurate state
          fetchJoinedClubsCallback();
        }
      });
      
      if (!success) {
        // If leave failed, revert the optimistic update
        await fetchJoinedClubsCallback(); // Refresh actual state from server
      }
    } catch (error: any) {
      console.error('Error in handleLeaveClub:', error);
      
      // Revert optimistic update on error by refreshing data
      await fetchJoinedClubsCallback();
      
      setState(prev => ({
        ...prev,
        error: error?.message || 'Failed to leave club'
      }));
    }
  };

  return { 
    fetchJoinedClubsCallback, 
    handleJoinClub, 
    handleLeaveClub 
  };
};
