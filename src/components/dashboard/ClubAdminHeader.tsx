
import React from 'react';
import CreateClubDialog from './CreateClubDialog';
import CreateEventDialog from './CreateEventDialog';
import { ClubFormData, EventFormData } from '@/hooks/club-admin/types';

interface ClubAdminHeaderProps {
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  onClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCreateClub: () => void;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (open: boolean) => void;
  eventFormData: EventFormData;
  clubs: any[];
  onEventInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCreateEvent: () => void;
  // Updated props for file upload
  onClubFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  onEventFileUpload?: (url: string, fileName: string) => void;
}

const ClubAdminHeader: React.FC<ClubAdminHeaderProps> = ({
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  onClubInputChange,
  onCreateClub,
  isEventDialogOpen,
  setIsEventDialogOpen,
  eventFormData,
  clubs,
  onEventInputChange,
  onCreateEvent,
  onClubFileUpload,
  onEventFileUpload
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold">Club Admin Dashboard</h1>
      
      <div className="flex gap-3">
        <CreateClubDialog
          isOpen={isClubDialogOpen}
          onOpenChange={setIsClubDialogOpen}
          formData={clubFormData}
          onInputChange={onClubInputChange}
          onSubmit={onCreateClub}
          onFileUpload={onClubFileUpload}
        />
        
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
