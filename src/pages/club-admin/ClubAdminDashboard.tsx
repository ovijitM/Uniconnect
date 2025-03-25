
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useClubAdminForms } from '@/hooks/club-admin/useClubAdminForms';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';

// Components
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardContent from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardContent';
import { useClubAdminRoutes } from '@/components/dashboard/club-admin/dashboard/useClubAdminRoutes';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [hasTriedProfile, setHasTriedProfile] = useState(false);
  const state = location.state as { openEventDialog?: boolean } | null;
  const { userUniversity, fetchUserProfile, isLoadingProfile, profileFetched } = useStudentProfile(user?.id);
  
  // Use our custom hook to detect routes
  const { currentView } = useClubAdminRoutes();
  
  const {
    adminClubs,
    clubEvents,
    clubMembers,
    activeEventCount,
    pastEventCount,
    totalMembersCount,
    averageAttendance,
    isLoading,
    loadingError,
    fetchClubAdminData,
    selectedEventId,
    selectedEventTitle,
    selectEventForAttendeeManagement
  } = useClubAdminData(user?.id);

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
    handleEventFileUpload
  } = useClubAdminForms(user?.id, fetchClubAdminData);

  // Fetch the user's university
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  // Handle retry for university profile
  useEffect(() => {
    if (profileFetched && !userUniversity && !hasTriedProfile && user?.id) {
      // Try fetching again after a slight delay if university wasn't found
      const retryTimer = setTimeout(() => {
        console.log("Retrying profile fetch since university is missing...");
        fetchUserProfile();
        setHasTriedProfile(true);
      }, 1500);
      
      return () => clearTimeout(retryTimer);
    }
  }, [profileFetched, userUniversity, fetchUserProfile, hasTriedProfile, user?.id]);

  // Handle opening event dialog when navigated with state
  useEffect(() => {
    if (state?.openEventDialog) {
      setIsEventDialogOpen(true);
      // Clear the state to prevent reopening when navigating back
      navigate(location.pathname, { replace: true });
    }
  }, [state, navigate, location.pathname, setIsEventDialogOpen]);

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') {
    toast({
      title: "Access Denied",
      description: "You don't have permissions for the club admin dashboard.",
      variant: "destructive",
    });
    return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;
  }

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

  const handleCreateClubClick = () => {
    if (!userUniversity) {
      toast({
        title: "University Required",
        description: "You need to have a university associated with your profile to create a club. Please update your profile first.",
        variant: "warning",
      });
      return;
    }
    setIsClubDialogOpen(true);
  };

  const handleRetry = () => {
    fetchClubAdminData();
  };

  // Add quick action buttons based on current view
  const renderQuickActions = () => {
    switch (currentView) {
      case 'events':
        return (
          <Button 
            onClick={() => setIsEventDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Event
          </Button>
        );
      case 'clubs':
        return (
          <Button 
            onClick={handleCreateClubClick}
            className="flex items-center gap-2"
            disabled={isLoadingProfile}
          >
            <PlusCircle className="h-4 w-4" />
            Create Club
            {isLoadingProfile && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        );
      default:
        return null;
    }
  };

  // Show loading indicator if profile is still loading
  if (isLoadingProfile && !profileFetched) {
    return (
      <DashboardLayout sidebar={<ClubAdminSidebar />}>
        <div className="container p-4 flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium">Loading your profile...</h3>
            <p className="text-muted-foreground">Please wait while we fetch your university information.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container p-4">
        {/* Error state with retry button */}
        {loadingError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading data</AlertTitle>
            <AlertDescription>Failed to load content. Please try again later.</AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </Alert>
        )}
        
        {/* Quick action buttons */}
        <div className="flex justify-end mb-4">
          {renderQuickActions()}
        </div>
        
        <ErrorBoundary>
          <ClubAdminDashboardContent
            currentView={currentView}
            adminClubs={adminClubs}
            clubEvents={clubEvents}
            clubMembers={clubMembers}
            activeEventCount={activeEventCount}
            pastEventCount={pastEventCount}
            totalMembersCount={totalMembersCount}
            averageAttendance={averageAttendance}
            isLoading={isLoading}
            selectedEventId={selectedEventId}
            selectedEventTitle={selectedEventTitle}
            isClubDialogOpen={isClubDialogOpen}
            setIsClubDialogOpen={setIsClubDialogOpen}
            clubFormData={clubFormData}
            handleClubInputChange={handleClubInputChange}
            handleCreateClub={handleCreateClub}
            handleClubFileUpload={handleClubFileUpload}
            isEventDialogOpen={isEventDialogOpen}
            setIsEventDialogOpen={setIsEventDialogOpen}
            eventFormData={eventFormData}
            handleEventInputChange={handleEventInputChange}
            handleCreateEvent={handleCreateEvent}
            handleEventFileUpload={handleEventFileUpload}
            handleViewEvent={handleViewEvent}
            handleEditEvent={handleEditEvent}
            handleRefreshAfterDelete={handleRefreshAfterDelete}
            fetchClubAdminData={fetchClubAdminData}
            selectEventForAttendeeManagement={selectEventForAttendeeManagement}
          />
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
