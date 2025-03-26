
import { useState } from 'react';
import { useClubFormState } from './useClubFormState';
import { useEventFormState } from './useEventFormState';
import { useClubCreation } from './useClubCreation';
import { useEventCreation } from './useEventCreation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClubAdminForms = (userId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
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

  // Check if user already has a club
  const [hasExistingClub, setHasExistingClub] = useState<boolean>(false);
  const [isCheckingClubs, setIsCheckingClubs] = useState<boolean>(false);

  // Handle event file upload
  const handleEventFileUpload = (url: string, fileName: string) => {
    setEventFormData(prev => ({ ...prev, imageUrl: url }));
  };

  // Check if user already has a club
  const checkUserHasClub = async () => {
    if (!userId) return false;
    
    setIsCheckingClubs(true);
    try {
      const { data, error } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error checking for existing clubs:", error);
        toast({
          title: "Error",
          description: "Could not verify your club status.",
          variant: "destructive",
        });
        return false;
      }
      
      const hasClub = data && data.length > 0;
      setHasExistingClub(hasClub);
      return hasClub;
    } catch (error) {
      console.error("Exception in checkUserHasClub:", error);
      return false;
    } finally {
      setIsCheckingClubs(false);
    }
  };

  // Handle club creation
  const handleCreateClub = async () => {
    try {
      console.log("Starting club creation process...");
      
      // Check if user already has a club
      const userHasClub = await checkUserHasClub();
      if (userHasClub) {
        toast({
          title: "Club Limit Reached",
          description: "You can only be an admin for one club. Please manage your existing club.",
          variant: "destructive",
        });
        setIsClubDialogOpen(false);
        return;
      }
      
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
    hasExistingClub,
    isCheckingClubs,
    checkUserHasClub,
    
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
