
import React from 'react';
import NoClubsView from '@/components/dashboard/NoClubsView';
import ManageClubsTable from '@/components/dashboard/ManageClubsTable';
import EventsTable from '@/components/dashboard/EventsTable';
import MembersTable from '@/components/dashboard/MembersTable';
import AttendeeManagement from '@/components/dashboard/AttendeeManagement';
import ClubProfileSettings from '@/components/dashboard/ClubProfileSettings';
import ClubAdminHeader from '@/components/dashboard/ClubAdminHeader';
import ClubAdminContent from '@/components/dashboard/ClubAdminContent';
import { ClubFormData, EventFormData } from '@/hooks/club-admin/useClubAdminForms';

interface ClubAdminDashboardContentProps {
  currentView: 'overview' | 'events' | 'clubs' | 'members' | 'attendance' | 'profile';
  adminClubs: any[];
  clubEvents: any[];
  clubMembers: any[];
  activeEventCount: number;
  pastEventCount: number;
  totalMembersCount: number;
  averageAttendance: number;
  isLoading: boolean;
  selectedEventId: string | null;
  selectedEventTitle: string;
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (open: boolean) => void;
  eventFormData: EventFormData;
  handleEventInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCreateEvent: () => void;
  handleViewEvent: (eventId: string) => void;
  handleEditEvent: (eventId: string) => void;
  handleRefreshAfterDelete: () => void;
  fetchClubAdminData: () => Promise<void>;
  selectEventForAttendeeManagement: (eventId: string, eventTitle: string) => void;
}

const ClubAdminDashboardContent: React.FC<ClubAdminDashboardContentProps> = ({
  currentView,
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
  isEventDialogOpen,
  setIsEventDialogOpen,
  eventFormData,
  handleEventInputChange,
  handleCreateEvent,
  handleViewEvent,
  handleEditEvent,
  handleRefreshAfterDelete,
  fetchClubAdminData,
  selectEventForAttendeeManagement
}) => {
  // Render different content based on the current view
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

  if (currentView === 'events') {
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

  if (currentView === 'clubs') {
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

  if (currentView === 'members') {
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

  if (currentView === 'attendance') {
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

  if (currentView === 'profile') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Club Profile Settings</h1>
        {adminClubs.length > 0 ? (
          <ClubProfileSettings 
            club={adminClubs[0]} 
            onRefresh={fetchClubAdminData}
            isLoading={isLoading}
          />
        ) : (
          <div className="p-6 text-center bg-muted rounded-lg">
            <p>No clubs found. Create a club to manage its profile.</p>
            <button 
              onClick={() => setIsClubDialogOpen(true)}
              className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Create Club
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

export default ClubAdminDashboardContent;
