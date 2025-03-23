
import React from 'react';
import MembersTable from '../MembersTable';

interface MembersSectionProps {
  members: any[];
  isLoading: boolean;
}

const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  isLoading
}) => {
  return (
    <MembersTable
      members={members}
      isLoading={isLoading}
    />
  );
};

export default MembersSection;
