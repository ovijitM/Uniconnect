
import React from 'react';
import ManageClubsTable from '@/components/dashboard/ManageClubsTable';

interface ClubsViewProps {
  clubs: any[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

const ClubsView: React.FC<ClubsViewProps> = ({
  clubs,
  isLoading,
  onRefresh
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Clubs</h1>
      <ManageClubsTable
        clubs={clubs}
        isLoading={isLoading}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default ClubsView;
