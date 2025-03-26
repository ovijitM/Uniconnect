
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useClubAdminForms } from '@/hooks/club-admin/useClubAdminForms';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';

export const useClubAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as { openEventDialog?: boolean } | null;
  const { userUniversity, fetchUserProfile, isLoadingProfile, error: profileError } = useStudentProfile(user?.id);
  
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
    if (user?.id) {
      fetchUserProfile();
      checkUserHasClub();
    }
  }, [user?.id, fetchUserProfile, checkUserHasClub]);

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
      fetchUserProfile();
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
    isCheckingClubs
  };
};
