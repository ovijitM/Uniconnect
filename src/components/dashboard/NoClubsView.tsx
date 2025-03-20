
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CreateClubDialog from './CreateClubDialog';

interface NoClubsViewProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  clubFormData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    establishedYear?: string;
    affiliation?: string;
    whyJoin?: string;
    regularEvents?: string;
    signatureEvents?: string;
    communityEngagement?: string;
    whoCanJoin?: string;
    membershipFee?: string;
    howToJoin?: string;
    presidentName?: string;
    presidentContact?: string;
    executiveMembers?: string;
    advisors?: string;
    phoneNumber?: string;
    website?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    discordLink?: string;
  };
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
