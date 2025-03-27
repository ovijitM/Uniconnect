
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
    if (!userId) return;
    
    try {
      const result = await fetchJoinedClubs(userId, toast);
      setState(prev => ({
        ...prev,
        joinedClubs: result.joinedClubs,
        joinedClubIds: result.joinedClubIds
      }));
    } catch (error: any) {
      console.error('Error fetching joined clubs:', error);
      setState(prev => ({
        ...prev,
        error: error?.message || 'Failed to fetch joined clubs'
      }));
    }
  }, [userId, toast]);

  const fetchClubs = async (userUniversity?: string | null) => {
    if (!userId) return;
    
    setState(prev => ({ ...prev, isLoadingClubs: true, error: null }));
    try {
      // First fetch joined clubs to update IDs
      await fetchJoinedClubsCallback();
      
      // Fetch all available clubs
      const allClubs = await fetchAllClubs(userId, userUniversity, toast);
      setState(prev => ({
        ...prev,
        clubs: allClubs,
        isLoadingClubs: false
      }));
    } catch (error: any) {
      console.error('Error fetching clubs:', error);
      setState(prev => ({ 
        ...prev, 
        isLoadingClubs: false,
        error: error?.message || 'Failed to fetch clubs'
      }));
    }
  };

  const handleJoinClub = async (clubId: string) => {
    try {
      await joinClub(userId!, clubId, toast, { onSuccess });
      
      // After successfully joining, refresh joined clubs
      await fetchJoinedClubsCallback();
      
      // Also update local state for immediate UI feedback
      const clubToAdd = state.clubs.find(c => c.id === clubId);
      if (clubToAdd) {
        setState(prev => ({
          ...prev,
          joinedClubs: [...prev.joinedClubs, clubToAdd],
          joinedClubIds: [...prev.joinedClubIds, clubId]
        }));
      }
    } catch (error: any) {
      console.error('Error joining club:', error);
      setState(prev => ({
        ...prev,
        error: error?.message || 'Failed to join club'
      }));
      throw error; // Re-throw to allow the component to handle the error
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    try {
      await leaveClub(userId, clubId, toast, { onSuccess });
      
      // Immediately update local state for UI
      setState(prev => ({
        ...prev,
        joinedClubs: prev.joinedClubs.filter(club => club.id !== clubId),
        joinedClubIds: prev.joinedClubIds.filter(id => id !== clubId)
      }));
      
      // Fetch joined clubs to ensure UI is in sync with DB
      await fetchJoinedClubsCallback();
    } catch (error: any) {
      console.error('Error in handleLeaveClub:', error);
      setState(prev => ({
        ...prev,
        error: error?.message || 'Failed to leave club'
      }));
    }
  };

  // Run fetchJoinedClubs initially to populate the joined clubs state
  useEffect(() => {
    if (userId) {
      fetchJoinedClubsCallback();
    }
  }, [userId, fetchJoinedClubsCallback]);

  // Add useEffect to log joinedClubs whenever it changes
  useEffect(() => {
    console.log('Current joined clubs:', state.joinedClubs);
    console.log('Current joined club IDs:', state.joinedClubIds);
  }, [state.joinedClubs, state.joinedClubIds]);

  return {
    clubs: state.clubs,
    joinedClubs: state.joinedClubs,
    joinedClubIds: state.joinedClubIds,
    isLoadingClubs: state.isLoadingClubs,
    error: state.error,
    fetchClubs,
    joinClub: handleJoinClub,
    leaveClub: handleLeaveClub
  };
};
