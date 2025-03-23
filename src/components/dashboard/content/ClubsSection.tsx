
import React from 'react';
import ManageClubsTable from '../ManageClubsTable';

interface ClubsSectionProps {
  clubs: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

const ClubsSection: React.FC<ClubsSectionProps> = ({
  clubs,
  isLoading,
  onRefresh
}) => {
  return (
    <ManageClubsTable
      clubs={clubs}
      isLoading={isLoading}
      onRefresh={onRefresh}
    />
  );
};

export default ClubsSection;
