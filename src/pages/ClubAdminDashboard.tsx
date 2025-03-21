
import React, { useEffect } from 'react';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';
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
import ManageClubsTable from '@/components/dashboard/ManageClubsTable';
import EventsTable from '@/components/dashboard/EventsTable';
import MembersTable from '@/components/dashboard/MembersTable';
import AttendeeManagement from '@/components/dashboard/AttendeeManagement';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { openEventDialog?: boolean } | null;
  
  // Match patterns for different routes
  const isOverview = useMatch('/club-admin-dashboard');
  const isEventsPage = useMatch('/club-admin-dashboard/events');
  const isClubsPage = useMatch('/club-admin-dashboard/clubs');
  const isMembersPage = useMatch('/club-admin-dashboard/members');
  const isAttendancePage = useMatch('/club-admin-dashboard/attendance');
  
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

  // Render different content based on the current route
  const renderContent = () => {
    if (adminClubs.length === 0 && !isLoading) {
      return (
        <NoClubsView 
          isDialogOpen={isClubDialogOpen}
          setIsDialogOpen={setIsClubDialogOpen}
          clubFormData={clubFormData}
          handleClubInputChange={handleClubInputChange}
          handleCreateClub={handleCreateClub}
        />
      );
    }

    if (isEventsPage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Manage Events</h1>
          <EventsTable 
            events={clubEvents}
            isLoading={isLoading}
            onEditEvent={handleEditEvent}
            onViewEvent={handleViewEvent}
            onCreateEvent={() => setIsEventDialogOpen(true)}
            onDeleteEvent={handleRefreshAfterDelete}
            onManageAttendees={selectEventForAttendeeManagement}
          />
        </div>
      );
    }

    if (isClubsPage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Manage Clubs</h1>
          <ManageClubsTable
            clubs={adminClubs}
            isLoading={isLoading}
            onRefresh={fetchClubAdminData}
          />
        </div>
      );
    }

    if (isMembersPage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Club Members</h1>
          <MembersTable
            members={clubMembers}
            isLoading={isLoading}
          />
        </div>
      );
    }

    if (isAttendancePage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          {clubEvents.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-4">Select an event to manage attendance</p>
              <EventsTable 
                events={clubEvents}
                isLoading={isLoading}
                onEditEvent={handleEditEvent}
                onViewEvent={handleViewEvent}
                onCreateEvent={() => setIsEventDialogOpen(true)}
                onDeleteEvent={handleRefreshAfterDelete}
                onManageAttendees={selectEventForAttendeeManagement}
              />
              {selectedEventId && (
                <AttendeeManagement 
                  eventId={selectedEventId}
                  eventTitle={selectedEventTitle}
                />
              )}
            </>
          ) : (
            <div className="p-6 text-center bg-muted rounded-lg">
              <p>No events found. Create an event to manage attendance.</p>
              <button 
                onClick={() => setIsEventDialogOpen(true)}
                className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Create Event
              </button>
            </div>
          )}
        </div>
      );
    }

    // Default overview page
    return (
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
    );
  };

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
