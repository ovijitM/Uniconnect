
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchJoinedClubs } from './utils/fetchJoinedClubs';
import { fetchAllClubs } from './utils/fetchAllClubs';
import { joinClub, leaveClub } from './utils/clubMembershipActions';
import { StudentClubsState } from './types/studentClubTypes';
import { Club } from '@/types';

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
  }, [userId, toast]);

  const fetchClubs = async (userUniversity?: string | null) => {
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
  };

  const handleJoinClub = async (clubId: string) => {
    try {
      console.log(`Starting join club process for club ${clubId}`);
      
      // Optimistically update UI
      const clubToJoin = state.clubs.find(club => club.id === clubId);
      setState(prev => ({
        ...prev,
        joinedClubIds: [...prev.joinedClubIds, clubId],
        joinedClubs: clubToJoin ? [...prev.joinedClubs, clubToJoin] : prev.joinedClubs
      }));
      
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

  // Run fetchJoinedClubs initially to populate the joined clubs state
  useEffect(() => {
    if (userId) {
      console.log("Initial fetch of joined clubs for user:", userId);
      fetchJoinedClubsCallback();
    }
  }, [userId, fetchJoinedClubsCallback]);

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
