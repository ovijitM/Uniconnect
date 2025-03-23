
import React from 'react';
import NoClubsView from '@/components/dashboard/NoClubsView';
import { ClubFormData } from '@/hooks/club-admin/useClubAdminForms';

interface NoClubsViewWrapperProps {
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
}

const NoClubsViewWrapper: React.FC<NoClubsViewWrapperProps> = ({
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub
}) => {
  return (
    <NoClubsView 
      isDialogOpen={isClubDialogOpen}
      setIsDialogOpen={setIsClubDialogOpen}
      clubFormData={clubFormData}
      handleClubInputChange={handleClubInputChange}
      handleCreateClub={handleCreateClub}
    />
  );
};

export default NoClubsViewWrapper;
