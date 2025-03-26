
import { useState } from 'react';
import { useClubFormState } from './useClubFormState';
import { useEventFormState } from './useEventFormState';
import { useClubCreation } from './useClubCreation';
import { useEventCreation } from './useEventCreation';

export const useClubAdminForms = (userId: string | undefined, onSuccess: () => void) => {
  // Get club form state and handlers
  const {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    handleClubInputChange,
    handleClubFileUpload,
    isLoadingProfile,
    profileError,
  } = useClubFormState();

  // Get event form state and handlers
  const {
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleEventInputChange
  } = useEventFormState();
  
  // Get club creation and event creation hooks
  const { createClub, isSubmitting: isClubSubmitting } = useClubCreation();
  const { createEvent, isSubmitting: isEventSubmitting, selectedCollaborators, setSelectedCollaborators } = useEventCreation(userId, onSuccess);

  // Handle event file upload
  const handleEventFileUpload = (url: string, fileName: string) => {
    setEventFormData(prev => ({ ...prev, imageUrl: url }));
  };

  // Handle club creation
  const handleCreateClub = async () => {
    try {
      console.log("Starting club creation process...");
      const result = await createClub(clubFormData, userId);
      
      if (result.success) {
        setIsClubDialogOpen(false);
        onSuccess(); // Refresh data after successful creation
      }
    } catch (error) {
      console.error("Error in club creation:", error);
    }
  };

  // Handle event creation
  const handleCreateEvent = async () => {
    try {
      console.log("Starting event creation process...");
      await createEvent(eventFormData, setEventFormData, setIsEventDialogOpen, selectedCollaborators);
      setSelectedCollaborators([]);
    } catch (error) {
      console.error("Error in event creation:", error);
    }
  };

  return {
    // Club form
    clubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    handleClubInputChange,
    handleCreateClub,
    handleClubFileUpload,
    isSubmittingClub: isClubSubmitting,
    
    // Event form
    eventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleEventInputChange,
    handleCreateEvent,
    handleEventFileUpload,
    isSubmittingEvent: isEventSubmitting,
    selectedCollaborators,
    setSelectedCollaborators,
    
    // Profile loading state
    isLoadingProfile,
    profileError
  };
};
