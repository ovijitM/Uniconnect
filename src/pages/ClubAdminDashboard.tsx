
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useClubAdminForms } from '@/hooks/club-admin/useClubAdminForms';

// Components
import ClubAdminHeader from '@/components/dashboard/ClubAdminHeader';
import ClubAdminContent from '@/components/dashboard/ClubAdminContent';
import NoClubsView from '@/components/dashboard/NoClubsView';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { openEventDialog?: boolean } | null;
  
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
  }, [state]);

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const handleRefreshAfterDelete = () => {
    fetchClubAdminData();
  };

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container">
        {adminClubs.length === 0 && !isLoading ? (
          <NoClubsView 
            isDialogOpen={isClubDialogOpen}
            setIsDialogOpen={setIsClubDialogOpen}
            clubFormData={clubFormData}
            handleClubInputChange={handleClubInputChange}
            handleCreateClub={handleCreateClub}
          />
        ) : (
          <>
            <ClubAdminHeader 
              isClubDialogOpen={isClubDialogOpen}
              setIsClubDialogOpen={setIsClubDialogOpen}
              clubFormData={clubFormData}
              onClubInputChange={handleClubInputChange}
              onCreateClub={handleCreateClub}
              isEventDialogOpen={isEventDialogOpen}
              setIsEventDialogOpen={setIsEventDialogOpen}
              eventFormData={eventFormData}
              clubs={adminClubs}
              onEventInputChange={handleEventInputChange}
              onCreateEvent={handleCreateEvent}
            />

            <ClubAdminContent 
              activeEventCount={activeEventCount}
              totalMembersCount={totalMembersCount}
              pastEventCount={pastEventCount}
              averageAttendance={averageAttendance}
              clubEvents={clubEvents}
              adminClubs={adminClubs}
              clubMembers={clubMembers}
              isLoading={isLoading}
              onEditEvent={handleEditEvent}
              onViewEvent={handleViewEvent}
              onCreateEvent={() => setIsEventDialogOpen(true)}
              onDeleteEvent={handleRefreshAfterDelete}
              onRefreshData={fetchClubAdminData}
              selectedEventId={selectedEventId}
              selectedEventTitle={selectedEventTitle}
              onSelectEvent={selectEventForAttendeeManagement}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
