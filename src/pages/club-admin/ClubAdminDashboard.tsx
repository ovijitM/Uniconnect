
import React, { useEffect } from 'react';
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
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as { openEventDialog?: boolean } | null;
  const { userUniversity, fetchUserProfile, isLoadingProfile, error: profileError } = useStudentProfile(user?.id);
  
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

  const handleRetryProfileFetch = () => {
    if (user?.id) {
      fetchUserProfile();
      toast({
        title: "Retrying",
        description: "Attempting to reload your profile data...",
      });
    }
  };

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
    setIsClubDialogOpen(true);
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
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container p-4">
        {/* Profile error alert */}
        {profileError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Profile Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{profileError}</p>
              <p>This may prevent you from creating clubs or accessing certain features.</p>
              <Button 
                onClick={handleRetryProfileFetch} 
                variant="outline" 
                size="sm" 
                className="w-fit mt-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Loading Profile
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Quick action buttons */}
        <div className="flex justify-end mb-4">
          {renderQuickActions()}
        </div>
        
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
          isLoadingProfile={isLoadingProfile}
          profileError={profileError}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
