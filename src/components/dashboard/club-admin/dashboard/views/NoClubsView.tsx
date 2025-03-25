
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from '@/hooks/club-admin/types';
import CreateClubDialog from '@/components/dashboard/CreateClubDialog';

interface NoClubsViewProps {
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
  handleClubFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
}

const NoClubsView: React.FC<NoClubsViewProps> = ({
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub,
  handleClubFileUpload
}) => {
  const { toast } = useToast();

  const handleCreateClubClick = () => {
    setIsClubDialogOpen(true);
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="text-center space-y-6 p-10 border rounded-lg bg-background shadow-sm">
        <h1 className="text-3xl font-bold">Welcome to Club Admin Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You don't have any clubs yet. Create your first club to start organizing events,
          managing members, and building your campus community.
        </p>
        
        <div className="mt-6 flex flex-col items-center gap-4">
          <Button onClick={handleCreateClubClick} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Your First Club
          </Button>
        </div>
      </div>

      {/* Club creation dialog */}
      <CreateClubDialog
        isOpen={isClubDialogOpen}
        onOpenChange={setIsClubDialogOpen}
        formData={clubFormData}
        onInputChange={handleClubInputChange}
        onSubmit={handleCreateClub}
        onFileUpload={handleClubFileUpload}
        buttonText="Create Club"
      />
    </div>
  );
};

export default NoClubsView;
