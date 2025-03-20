
import { useClubForm } from './useClubForm';
import { useEventForm } from './useEventForm';
import { ClubFormData, EventFormData } from './types';

export type { ClubFormData, EventFormData };

export const useClubAdminForms = (userId: string | undefined, fetchClubAdminData: () => void) => {
  const {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    handleClubInputChange,
    handleCreateClub
  } = useClubForm(userId, fetchClubAdminData);

  const {
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    isSubmitting: isEventSubmitting,
    handleEventInputChange,
    handleCreateEvent
  } = useEventForm(userId, fetchClubAdminData);

  return {
    // Club form
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    handleClubInputChange,
    handleCreateClub,
    
    // Event form
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    isEventSubmitting,
    handleEventInputChange,
    handleCreateEvent
  };
};
