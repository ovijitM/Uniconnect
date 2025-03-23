
import React from 'react';
import MembersTable from '@/components/dashboard/MembersTable';

interface MembersViewProps {
  members: any[];
  isLoading: boolean;
}

const MembersView: React.FC<MembersViewProps> = ({
  members,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Club Members</h1>
      <MembersTable
        members={members}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MembersView;
