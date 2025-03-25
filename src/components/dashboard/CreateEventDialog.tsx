
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import EventDialogWrapper from './event-dialog/EventDialogWrapper';

interface CreateEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxParticipants: string;
    clubId: string;
    imageUrl?: string; // Added field for event banner/poster
    tagline?: string;
    eventType?: string;
    registrationDeadline?: string;
    onlinePlatform?: string;
    eligibility?: string;
    teamSize?: string;
    registrationLink?: string;
    entryFee?: string;
    theme?: string;
    subTracks?: string;
    prizePool?: string;
    prizeCategories?: string;
    additionalPerks?: string;
    judgingCriteria?: string;
    judges?: string;
    deliverables?: string;
    submissionPlatform?: string;
    mentors?: string;
    sponsors?: string;
    contactEmail?: string;
    communityLink?: string;
    eventWebsite?: string;
    eventHashtag?: string;
    visibility: 'public' | 'university_only';
  };
  clubs: any[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  buttonText?: string;
  trigger?: React.ReactNode;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  clubs,
  onInputChange,
  onSubmit,
  buttonText = "Create New Event",
  trigger
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
    />
  );
};

export default CreateEventDialog;
