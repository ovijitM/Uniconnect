
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClubManagement } from '@/hooks/club-admin/useClubManagement';
import ClubsTable from './club-management/ClubsTable';
import EditClubDialog from './club-management/EditClubDialog';
import DeleteClubDialog from './club-management/DeleteClubDialog';

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  logo_url?: string;
  rejection_reason?: string;
}

interface ManageClubsTableProps {
  clubs: Club[];
  isLoading: boolean;
  onRefresh: () => void;
}

const ManageClubsTable: React.FC<ManageClubsTableProps> = ({
  clubs,
  isLoading,
  onRefresh
}) => {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedClub,
    editFormData,
    isSubmitting,
    openEditDialog,
    openDeleteDialog,
    handleEditClub,
    handleDeleteClub,
    handleInputChange
  } = useClubManagement(onRefresh);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Clubs</CardTitle>
          <CardDescription>Edit or delete clubs you administrate</CardDescription>
        </CardHeader>
        <CardContent>
          <ClubsTable
            clubs={clubs}
            isLoading={isLoading}
            onEditClub={openEditDialog}
            onDeleteClub={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <EditClubDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedClub={selectedClub}
        editFormData={editFormData}
        handleInputChange={handleInputChange}
        handleEditClub={handleEditClub}
        isSubmitting={isSubmitting}
      />

      <DeleteClubDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedClub={selectedClub}
        handleDeleteClub={handleDeleteClub}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default ManageClubsTable;
