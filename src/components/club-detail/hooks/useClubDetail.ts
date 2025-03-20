
import { useClubData } from './useClubData';
import { useClubMembership } from './useClubMembership';
import { useClubAdmin } from './useClubAdmin';

export const useClubDetail = () => {
  const { club, setClub, events, isLoading, relatedClubs } = useClubData();
  const { isMember, isJoining, handleJoinClub } = useClubMembership(club, setClub);
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
    handleJoinClub
  };
};
