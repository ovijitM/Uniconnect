
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import ClubDialogWrapper from './club-dialog/ClubDialogWrapper';

interface CreateClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    logoUrl?: string;
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
    documentUrl?: string;
    documentName?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onFileUpload?: (url: string, fileName: string) => void;
  buttonText?: string;
  trigger?: React.ReactNode;
}

const CreateClubDialog: React.FC<CreateClubDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  onFileUpload,
  buttonText = "Create New Club",
  trigger
}) => {
  const defaultTrigger = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );

  return (
    <ClubDialogWrapper
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      formData={formData}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
      onFileUpload={onFileUpload}
      buttonText="Create Club"
      trigger={trigger || defaultTrigger}
    />
  );
};

export default CreateClubDialog;
