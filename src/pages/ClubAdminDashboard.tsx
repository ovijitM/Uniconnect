
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useClubAdminForms } from '@/hooks/club-admin/useClubAdminForms';

// Components
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardContent from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardContent';
import { useClubAdminRoutes } from '@/components/dashboard/club-admin/dashboard/useClubAdminRoutes';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const state = location.state as { openEventDialog?: boolean } | null;
  
  // Check if we're in an edit route
  const isEventEdit = location.pathname.includes('/events/') && location.pathname.includes('/edit');
  const isClubEdit = location.pathname.includes('/clubs/') && location.pathname.includes('/edit');
  const eventId = params.eventId;
  const clubId = params.clubId;
  
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
    handleClubInputChange
  } = useClubAdminForms(user?.id, fetchClubAdminData);

  // Handle opening event dialog when navigated with state
  useEffect(() => {
    if (state?.openEventDialog) {
      setIsEventDialogOpen(true);
      // Clear the state to prevent reopening when navigating back
      navigate(location.pathname, { replace: true });
    }
    
    // Handle event edit route
    if (isEventEdit && eventId) {
      const event = clubEvents.find(e => e.id === eventId);
      if (event) {
        handleEditEvent(eventId);
      } else {
        // If event not found, redirect to 404
        navigate('/not-found');
      }
    }
    
    // Handle club edit route
    if (isClubEdit && clubId) {
      const club = adminClubs.find(c => c.id === clubId);
      if (club) {
        // Handle club edit
        // This would typically open a dialog or redirect to a form
        console.log('Editing club:', club);
      } else {
        // If club not found, redirect to 404
        navigate('/not-found');
      }
    }
  }, [state, isEventEdit, isClubEdit, eventId, clubId, clubEvents, adminClubs]);

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    // Instead of navigating away, we'll open the edit dialog
    // This is a temporary solution until we have a dedicated event edit page
    setIsEventDialogOpen(true);
    // Here we would populate the event form data with the event details
    // This is simplified for now
    console.log('Edit event:', eventId);
  };

  const handleRefreshAfterDelete = () => {
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
