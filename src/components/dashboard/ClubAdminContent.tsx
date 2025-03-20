
import React from 'react';
import UpcomingEvents from './UpcomingEvents';
import ClubsList from './ClubsList';
import EventsTable from './EventsTable';
import MembersTable from './MembersTable';
import ManageClubsTable from './ManageClubsTable';
import StatCards from './StatCards';
import AttendeeManagement from './AttendeeManagement';

interface ClubAdminContentProps {
  activeEventCount: number;
  totalMembersCount: number;
  pastEventCount: number;
  averageAttendance: number;
  clubEvents: any[];
  adminClubs: any[];
  clubMembers: any[];
  isLoading: boolean;
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
  onCreateEvent: () => void;
  onDeleteEvent: (eventId: string) => void;
  onRefreshData: () => void;
  selectedEventId: string | null;
  selectedEventTitle: string;
  onSelectEvent: (eventId: string, eventTitle: string) => void;
}

const ClubAdminContent: React.FC<ClubAdminContentProps> = ({
  activeEventCount,
  totalMembersCount,
  pastEventCount,
  averageAttendance,
  clubEvents,
  adminClubs,
  clubMembers,
  isLoading,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
  onDeleteEvent,
  onRefreshData,
  selectedEventId,
  selectedEventTitle,
  onSelectEvent
}) => {
  return (
    <>
      <StatCards
        activeEventCount={activeEventCount}
        totalMembersCount={totalMembersCount}
        pastEventCount={pastEventCount}
        averageAttendance={averageAttendance}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <UpcomingEvents 
          events={clubEvents}
          isLoading={isLoading}
          onEditEvent={onEditEvent}
          onViewEvent={onViewEvent}
        />

        <ClubsList 
          clubs={adminClubs}
          isLoading={isLoading}
        />
      </div>

      {selectedEventId && (
        <div className="mb-6">
          <AttendeeManagement 
            eventId={selectedEventId}
            eventTitle={selectedEventTitle}
          />
        </div>
      )}

      <ManageClubsTable
        clubs={adminClubs}
        isLoading={isLoading}
        onRefresh={onRefreshData}
      />

      <EventsTable
        events={clubEvents}
        isLoading={isLoading}
        onEditEvent={onEditEvent}
        onViewEvent={onViewEvent}
        onCreateEvent={onCreateEvent}
        onDeleteEvent={onDeleteEvent}
        onManageAttendees={onSelectEvent}
      />

      <MembersTable
        members={clubMembers}
        isLoading={isLoading}
      />
    </>
  );
};

export default ClubAdminContent;
