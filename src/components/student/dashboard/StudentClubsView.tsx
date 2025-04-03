
import React, { useEffect, useState } from 'react';
import StudentClubs from '@/components/student/StudentClubs';
import AvailableClubs from '@/components/student/AvailableClubs';

interface StudentClubsViewProps {
  clubs: any[];
  joinedClubs: any[];
  joinedClubIds: string[];
  isLoading: boolean;
  onJoinClub: (clubId: string) => Promise<void>;
  onLeaveClub: (clubId: string) => Promise<void>;
}

const StudentClubsView: React.FC<StudentClubsViewProps> = ({
  clubs,
  joinedClubs,
  joinedClubIds,
  isLoading,
  onJoinClub,
  onLeaveClub
}) => {
  // Local state to track joined clubs and IDs (for immediate UI updates)
  const [localJoinedClubIds, setLocalJoinedClubIds] = useState<string[]>(joinedClubIds);
  const [localJoinedClubs, setLocalJoinedClubs] = useState<any[]>(joinedClubs);
  const [localAvailableClubs, setLocalAvailableClubs] = useState<any[]>([]);
  
  // Update local state when props change
  useEffect(() => {
    console.log("StudentClubsView - Joined Clubs updated:", joinedClubs);
    console.log("StudentClubsView - Joined Club IDs updated:", joinedClubIds);
    setLocalJoinedClubIds(joinedClubIds);
    setLocalJoinedClubs(joinedClubs);
    updateAvailableClubs();
  }, [joinedClubs, joinedClubIds, clubs]);
  
  // Helper function to update available clubs
  const updateAvailableClubs = () => {
    const available = clubs.filter(club => !joinedClubIds.includes(club.id));
    console.log("StudentClubsView - Available Clubs updated:", available);
    setLocalAvailableClubs(available);
  };
  
  // Enhanced join club handler with optimistic UI updates
  const handleJoinClub = async (clubId: string) => {
    try {
      // Find the club being joined
      const clubToJoin = clubs.find(club => club.id === clubId);
      if (!clubToJoin) return;
      
      // Optimistically update UI
      setLocalJoinedClubIds(prev => [...prev, clubId]);
      setLocalJoinedClubs(prev => [...prev, clubToJoin]);
      setLocalAvailableClubs(prev => prev.filter(club => club.id !== clubId));
      
      // Call the actual join function
      await onJoinClub(clubId);
    } catch (error) {
      console.error("Error joining club:", error);
      // Revert optimistic update on error
      updateAvailableClubs();
      setLocalJoinedClubIds(joinedClubIds);
      setLocalJoinedClubs(joinedClubs);
    }
  };
  
  // Enhanced leave club handler with optimistic UI updates
  const handleLeaveClub = async (clubId: string) => {
    try {
      // Find the club being left
      const clubToLeave = localJoinedClubs.find(club => club.id === clubId);
      if (!clubToLeave) return;
      
      // Optimistically update UI
      setLocalJoinedClubIds(prev => prev.filter(id => id !== clubId));
      setLocalJoinedClubs(prev => prev.filter(club => club.id !== clubId));
      setLocalAvailableClubs(prev => [...prev, clubToLeave]);
      
      // Call the actual leave function
      await onLeaveClub(clubId);
    } catch (error) {
      console.error("Error leaving club:", error);
      // Revert optimistic update on error
      updateAvailableClubs();
      setLocalJoinedClubIds(joinedClubIds);
      setLocalJoinedClubs(joinedClubs);
    }
  };

  console.log("StudentClubsView - Rendering with:", {
    localJoinedClubs,
    localAvailableClubs,
    localJoinedClubIds
  });

  return (
    <div className="space-y-6">
      <div className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">My Clubs</h1>
        <p className="text-muted-foreground">Manage your club memberships from any university</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold px-2">Joined Clubs</h2>
          <StudentClubs 
            clubs={localJoinedClubs}
            isLoading={isLoading}
            onLeaveClub={handleLeaveClub}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold px-2">Available Clubs</h2>
          <AvailableClubs 
            clubs={localAvailableClubs}
            joinedClubIds={localJoinedClubIds}
            isLoading={isLoading}
            onJoinClub={handleJoinClub}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentClubsView;
