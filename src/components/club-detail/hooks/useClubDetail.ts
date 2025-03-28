
import { useClubData } from './useClubData';
import { useClubMembership } from './useClubMembership';
import { useClubAdmin } from './useClubAdmin';

export const useClubDetail = (clubId?: string) => {
  const { club, setClub, events, isLoading, relatedClubs, error } = useClubData(clubId);
  const { isMember, isJoining, handleJoinClub, checkMembership } = useClubMembership(club, setClub);
  const { isAdmin, isClubAdmin } = useClubAdmin();

  return {
    club,
    events,
    isLoading,
    isMember,
    isJoining,
    relatedClubs,
    isAdmin,
    isClubAdmin,
    handleJoinClub,
    checkMembership,
    error
  };
};
