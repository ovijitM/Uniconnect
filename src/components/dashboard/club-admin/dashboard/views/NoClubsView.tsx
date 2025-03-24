
// Import related code and create a NoClubsViewWrapper component that includes the document upload functionality
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClubFormData } from '@/hooks/club-admin/useClubAdminForms';
import CreateClubDialog from '@/components/dashboard/CreateClubDialog';

interface NoClubsViewWrapperProps {
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
  handleClubFileUpload?: (url: string, fileName: string) => void;
}

const NoClubsViewWrapper: React.FC<NoClubsViewWrapperProps> = ({
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub,
  handleClubFileUpload
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to the Club Admin Dashboard</CardTitle>
        <CardDescription>
          You don't have any clubs yet. Create your first club to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <CreateClubDialog
          isOpen={isClubDialogOpen}
          onOpenChange={setIsClubDialogOpen}
          formData={clubFormData}
          onInputChange={handleClubInputChange}
          onSubmit={handleCreateClub}
          onFileUpload={handleClubFileUpload}
          buttonText="Create Your First Club"
        />
      </CardContent>
    </Card>
  );
};

export default NoClubsViewWrapper;
