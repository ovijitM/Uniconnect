
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useClubAdminForms } from '@/hooks/club-admin/useClubAdminForms';

// Components
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardContent from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardContent';
import { useClubAdminRoutes } from '@/components/dashboard/club-admin/dashboard/useClubAdminRoutes';
import { useToast } from '@/hooks/use-toast';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as { openEventDialog?: boolean } | null;
  
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

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container">
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
          handleViewEvent={handleViewEvent}
          handleEditEvent={handleEditEvent}
          handleRefreshAfterDelete={handleRefreshAfterDelete}
          fetchClubAdminData={fetchClubAdminData}
          selectEventForAttendeeManagement={selectEventForAttendeeManagement}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
