
import React from 'react';
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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Clubs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Joined Clubs</h2>
          <StudentClubs 
            clubs={joinedClubs}
            isLoading={isLoading}
            onLeaveClub={onLeaveClub}
          />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-4">Available Clubs</h2>
          <AvailableClubs 
            clubs={clubs.filter(club => !joinedClubIds.includes(club.id))}
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
