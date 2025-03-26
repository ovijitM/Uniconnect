
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useClubAdminForms } from '@/hooks/club-admin/useClubAdminForms';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { isNetworkError } from '@/hooks/club-admin/utils/dataTransformUtils';

export const useClubAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as { openEventDialog?: boolean } | null;
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  const { 
    userUniversity, 
    fetchUserProfile, 
    isLoadingProfile, 
    error: profileError 
  } = useStudentProfile(user?.id);
  
  // Use the existing club admin data hook
  const {
    adminClubs,
    clubEvents,
    clubMembers,
    activeEventCount,
    pastEventCount,
    totalMembersCount,
    averageAttendance,
    isLoading,
    fetchClubAdminData,
    selectedEventId,
    selectedEventTitle,
    selectEventForAttendeeManagement
  } = useClubAdminData(user?.id);

  // Use the existing club admin forms hook
  const {
    eventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    clubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    handleCreateClub,
    handleCreateEvent,
    handleEventInputChange,
    handleClubInputChange,
    handleClubFileUpload,
    handleEventFileUpload,
    hasExistingClub,
    isCheckingClubs,
    checkUserHasClub
  } = useClubAdminForms(user?.id, fetchClubAdminData);

  // Fetch the user's university on initial load
  useEffect(() => {
    if (user?.id && !initialLoadAttempted) {
      setInitialLoadAttempted(true);
      
      const loadProfileAndCheckClubs = async () => {
        try {
          await fetchUserProfile();
          await checkUserHasClub();
        } catch (error) {
          console.error("Error during initial profile and club check:", error);
          
          // Only retry if it's a network error and we haven't exceeded max retries
          if (isNetworkError(error) && retryCount < MAX_RETRIES) {
            // Use exponential backoff for retries
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
            
            toast({
              title: "Connection Error",
              description: `Retry ${retryCount + 1}/${MAX_RETRIES}: Attempting to reconnect in ${retryDelay/1000} seconds...`,
              variant: "destructive",
            });
            
            // Increment retry count before starting the timer
            setRetryCount(prevCount => prevCount + 1);
            
            // Retry after delay
            setTimeout(() => {
              setInitialLoadAttempted(false);
            }, retryDelay);
          } else {
            // If we've hit max retries or it's not a network error, show a final error
            toast({
              title: "Connection Failed",
              description: `Failed to load data after ${MAX_RETRIES} attempts. Please check your connection and refresh the page.`,
              variant: "destructive",
            });
          }
        }
      };
      
      loadProfileAndCheckClubs();
    }
  }, [user?.id, initialLoadAttempted, retryCount, fetchUserProfile, checkUserHasClub, toast, MAX_RETRIES]);

  // Handle opening event dialog when navigated with state
  useEffect(() => {
    if (state?.openEventDialog) {
      setIsEventDialogOpen(true);
      // Clear the state to prevent reopening when navigating back
      navigate(location.pathname, { replace: true });
    }
  }, [state, navigate, location.pathname, setIsEventDialogOpen]);

  const handleCreateClubClick = () => {
    if (!userUniversity) {
      if (profileError) {
        toast({
          title: "Profile Error",
          description: "Unable to load your university information. Please try again or update your profile.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "University Required",
        description: "You need to have a university associated with your profile to create a club. Please update your profile first.",
        variant: "warning",
      });
      return;
    }
    
    // Check if user already has a club
    if (hasExistingClub || adminClubs.length > 0) {
      toast({
        title: "Club Limit Reached",
        description: "You can only be an admin for one club. Please manage your existing club.",
        variant: "destructive",
      });
      return;
    }
    
    setIsClubDialogOpen(true);
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    // Find the event data to populate the form
    const event = clubEvents.find(e => e.id === eventId);
    if (event) {
      console.log('Editing event:', event);
      // Here would be the logic to populate the form data
      setIsEventDialogOpen(true);
    }
  };

  const handleRefreshAfterDelete = () => {
    console.log('Refreshing data after deletion');
    fetchClubAdminData();
  };

  const handleRetryProfileFetch = () => {
    if (user?.id) {
      // Reset retry count when manually retrying
      setRetryCount(0);
      setInitialLoadAttempted(false);
      
      toast({
        title: "Retrying",
        description: "Attempting to reload your profile data...",
      });
    }
  };

  return {
    user,
    adminClubs,
    clubEvents,
    clubMembers,
    activeEventCount,
    pastEventCount,
    totalMembersCount,
    averageAttendance,
    isLoading,
    selectedEventId,
    selectedEventTitle,
    isClubDialogOpen,
    setIsClubDialogOpen,
    clubFormData,
    handleClubInputChange,
    handleCreateClub,
    handleClubFileUpload,
    isEventDialogOpen,
    setIsEventDialogOpen,
    eventFormData,
    handleEventInputChange,
    handleCreateEvent,
    handleEventFileUpload,
    handleViewEvent,
    handleEditEvent,
    handleRefreshAfterDelete,
    fetchClubAdminData,
    selectEventForAttendeeManagement,
    isLoadingProfile,
    profileError,
    handleRetryProfileFetch,
    handleCreateClubClick,
    hasExistingClub,
    isCheckingClubs,
    retryCount,
    MAX_RETRIES
  };
};
