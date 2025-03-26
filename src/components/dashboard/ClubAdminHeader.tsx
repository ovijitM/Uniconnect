
import React from 'react';
import CreateEventDialog from './CreateEventDialog';
import { EventFormData, ClubFormData } from '@/hooks/club-admin/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ClubAdminHeaderProps {
  onCreateClub: () => void;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (open: boolean) => void;
  eventFormData: EventFormData;
  clubs: any[];
  onEventInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCreateEvent: () => void;
  onEventFileUpload?: (url: string, fileName: string) => void;
  // Add these properties to fix the type errors
  isClubDialogOpen?: boolean;
  setIsClubDialogOpen?: (open: boolean) => void;
  clubFormData?: ClubFormData;
  onClubInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClubFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  hasExistingClub?: boolean;
}

const ClubAdminHeader: React.FC<ClubAdminHeaderProps> = ({
  onCreateClub,
  isEventDialogOpen,
  setIsEventDialogOpen,
  eventFormData,
  clubs,
  onEventInputChange,
  onCreateEvent,
  onEventFileUpload,
  // We don't need to use these props in this component, just having them in the interface fixes the type errors
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  onClubInputChange,
  onClubFileUpload,
  hasExistingClub
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold">Club Admin Dashboard</h1>
      
      <div className="flex gap-3">
        <Button onClick={onCreateClub}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Club
        </Button>
        
        <CreateEventDialog
          isOpen={isEventDialogOpen}
          onOpenChange={setIsEventDialogOpen}
          formData={eventFormData}
          clubs={clubs}
          onInputChange={onEventInputChange}
          onSubmit={onCreateEvent}
          onFileUpload={onEventFileUpload}
        />
      </div>
    </div>
  );
};

export default ClubAdminHeader;
