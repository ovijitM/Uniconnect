
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import EventDialogWrapper from './event-dialog/EventDialogWrapper';
import { EventFormData } from '@/hooks/club-admin/types';

interface CreateEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EventFormData;
  clubs: any[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  buttonText?: string;
  trigger?: React.ReactNode;
  onFileUpload?: (url: string, fileName: string) => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  clubs,
  onInputChange,
  onSubmit,
  buttonText = "Create New Event",
  trigger,
  onFileUpload
}) => {
  const defaultTrigger = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );

  return (
    <EventDialogWrapper
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      formData={formData}
      clubs={clubs}
      onInputChange={onInputChange}
      onSubmit={onSubmit}
      buttonText="Create Event"
      trigger={trigger || defaultTrigger}
      onFileUpload={onFileUpload}
    />
  );
};

export default CreateEventDialog;
