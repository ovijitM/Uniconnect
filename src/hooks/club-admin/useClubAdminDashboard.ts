
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { EventFormData } from '@/hooks/club-admin/types';
import { fetchAdminClubsMemoized } from './utils/clubFetching';

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

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    eventType: 'in-person',
    maxParticipants: '',
    imageUrl: '',
    clubId: '',
    tagline: '',
    registrationDeadline: '',
    onlinePlatform: '',
    eligibility: '',
    teamSize: '',
    registrationLink: '',
    entryFee: 'Free',
    theme: '',
    subTracks: '',
    prizePool: '',
    prizeCategories: '',
    additionalPerks: '',
    judgingCriteria: '',
    judges: '',
    schedule: '',
    deliverables: '',
    submissionPlatform: '',
    mentors: '',
    sponsors: '',
    contactEmail: '',
    communityLink: '',
    eventWebsite: '',
    eventHashtag: '',
    howToRegister: '',
    visibility: 'public'
  });

  // Optimized fetch with caching and deduplicated requests
  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Use memoized function for efficient data fetching
      const adminClubsData = await fetchAdminClubsMemoized(user.id);
      
      if (adminClubsData.length > 0) {
        // Set initial club ID in event form if available
        setEventFormData(prev => ({
          ...prev,
          clubId: adminClubsData[0]?.id || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
      fetchDashboardData();
    }
  }, [user?.id, fetchUserProfile, fetchDashboardData]);

  useEffect(() => {
    if (state?.openEventDialog) {
      setIsEventDialogOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [state, navigate, location.pathname]);

  const handleCreateClubClick = useCallback(() => {
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
    
    navigate('/club-admin-dashboard/create-club');
  }, [userUniversity, profileError, toast, navigate]);

  const handleEventInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleEventFileUpload = useCallback((url: string, fileName: string) => {
    setEventFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  }, []);

  const handleCreateEvent = useCallback(() => {
    console.log('Create event functionality to be implemented');
    setIsEventDialogOpen(false);
  }, []);

  const handleViewEvent = useCallback((eventId: string) => {
    navigate(`/events/${eventId}`);
  }, [navigate]);

  const handleEditEvent = useCallback((eventId: string) => {
    const event = clubEvents.find(e => e.id === eventId);
    if (event) {
      console.log('Editing event:', event);
      setIsEventDialogOpen(true);
    }
  }, [clubEvents]);

  const handleRefreshAfterDelete = useCallback(() => {
    console.log('Refreshing data after deletion');
    fetchClubAdminData();
  }, [fetchClubAdminData]);

  const handleRetryProfileFetch = useCallback(() => {
    if (user?.id) {
      toast({
        title: "Retrying",
        description: "Attempting to reload your profile data...",
      });
      fetchUserProfile();
    }
  }, [user?.id, toast, fetchUserProfile]);

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
