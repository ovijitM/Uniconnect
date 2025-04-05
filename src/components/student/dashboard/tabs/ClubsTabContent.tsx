
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StudentClubs from '@/components/student/StudentClubs';

interface ClubsTabContentProps {
  joinedClubs: any[];
  isLoading: boolean;
  onLeaveClub: (clubId: string) => Promise<void>;
}

const ClubsTabContent: React.FC<ClubsTabContentProps> = ({
  joinedClubs,
  isLoading,
  onLeaveClub
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">My Clubs</h2>
        <StudentClubs 
          clubs={joinedClubs}
          isLoading={isLoading}
          onLeaveClub={onLeaveClub}
        />
      </CardContent>
    </Card>
  );
};

export default ClubsTabContent;
