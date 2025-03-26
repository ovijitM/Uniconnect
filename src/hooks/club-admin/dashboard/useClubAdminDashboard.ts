
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';

export const useClubAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as { openEventDialog?: boolean } | null;
  
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
    errorMessage,
    fetchClubAdminData,
    selectedEventId,
    selectedEventTitle,
    selectEventForAttendeeManagement
  } = useClubAdminData(user?.id);

  // Event dialog state
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    eventType: 'in-person',
    maxParticipants: '',
    imageUrl: '',
    clubId: '',
  });

  // Fetch the user's university on initial load
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  // Handle opening event dialog when navigated with state
  useEffect(() => {
    if (state?.openEventDialog) {
      setIsEventDialogOpen(true);
      // Clear the state to prevent reopening when navigating back
      navigate(location.pathname, { replace: true });
    }
  }, [state, navigate, location.pathname]);

  const handleCreateClubClick = () => {
    if (!userUniversity) {
      if (profileError) {
        toast({
          title: "Profile Error",
          description: "Unable to load your university information. Please update your profile.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "University Required",
        description: "You need to have a university associated with your profile to create a club.",
        variant: "warning",
      });
      return;
    }
    
    // Placeholder for future redirection to a dedicated club creation page
    toast({
      title: "Club Creation Coming Soon",
      description: "Club creation functionality is currently being updated. Please check back later.",
    });
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventFileUpload = (url: string, fileName: string) => {
    setEventFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  const handleCreateEvent = () => {
    console.log('Create event functionality to be implemented');
    setIsEventDialogOpen(false);
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
      toast({
        title: "Retrying",
        description: "Attempting to reload your profile data...",
      });
      fetchUserProfile();
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
    isEventDialogOpen,
    setIsEventDialogOpen,
    eventFormData,
    handleEventInputChange,
    handleEventFileUpload,
    handleCreateEvent,
    handleViewEvent,
    handleEditEvent,
    handleRefreshAfterDelete,
    fetchClubAdminData,
    selectEventForAttendeeManagement,
    isLoadingProfile,
    profileError,
    handleRetryProfileFetch,
    handleCreateClubClick,
    errorMessage
  };
};
