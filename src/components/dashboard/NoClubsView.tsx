
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CreateClubDialog from './CreateClubDialog';
import { ClubFormData } from '@/hooks/club-admin/types';

interface NoClubsViewProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
}

const NoClubsView: React.FC<NoClubsViewProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub,
}) => {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Welcome to Club Admin Dashboard</h2>
      <p className="text-muted-foreground mb-8">You haven't created any clubs yet. Create your first club to get started.</p>
      <CreateClubDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={clubFormData}
        onInputChange={handleClubInputChange}
        onSubmit={handleCreateClub}
        buttonText="Create Your First Club"
        trigger={
          <Button size="lg" onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Your First Club
          </Button>
        }
      />
    </div>
  );
};

export default NoClubsView;
