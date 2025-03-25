
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ClubDialogWrapper from './club-dialog/ClubDialogWrapper';
import { ClubFormData } from '@/hooks/club-admin/types';

interface CreateClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
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
