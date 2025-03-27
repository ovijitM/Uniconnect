
import React, { useEffect } from 'react';
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
  console.log("StudentClubsView - Joined Clubs:", joinedClubs);
  console.log("StudentClubsView - Available Clubs:", clubs.filter(club => !joinedClubIds.includes(club.id)));
  console.log("StudentClubsView - Joined Club IDs:", joinedClubIds);

  // Filter clubs to only show those that are not joined
  const availableClubs = clubs.filter(club => !joinedClubIds.includes(club.id));

  useEffect(() => {
    // Log specific details to help debug
    console.log("StudentClubsView - Club IDs check:");
    clubs.forEach(club => {
      console.log(`Club ${club.name} (${club.id}) - Joined: ${joinedClubIds.includes(club.id)}`);
    });
  }, [clubs, joinedClubIds]);

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
            clubs={joinedClubs}
            isLoading={isLoading}
            onLeaveClub={onLeaveClub}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold px-2">Available Clubs</h2>
          <AvailableClubs 
            clubs={availableClubs}
            joinedClubIds={joinedClubIds}
            isLoading={isLoading}
            onJoinClub={onJoinClub}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentClubsView;
