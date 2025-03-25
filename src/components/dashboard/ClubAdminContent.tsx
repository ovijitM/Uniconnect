
import React from 'react';
import StatCardsSection from './content/StatCardsSection';
import QuickViewSection from './content/QuickViewSection';
import AttendeeSection from './content/AttendeeSection';
import ClubsSection from './content/ClubsSection';
import EventsSection from './content/EventsSection';
import MembersSection from './content/MembersSection';

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
      <StatCardsSection
        activeEventCount={activeEventCount}
        totalMembersCount={totalMembersCount}
        pastEventCount={pastEventCount}
        averageAttendance={averageAttendance}
        isLoading={isLoading}
      />

      <QuickViewSection
        events={clubEvents}
        clubs={adminClubs}
        isLoading={isLoading}
        onEditEvent={onEditEvent}
        onViewEvent={onViewEvent}
      />

      {selectedEventId && (
        <AttendeeSection
          eventId={selectedEventId}
          eventTitle={selectedEventTitle}
        />
      )}

      <ClubsSection
        clubs={adminClubs}
        isLoading={isLoading}
        onRefresh={onRefreshData}
      />

      <EventsSection
        events={clubEvents}
        isLoading={isLoading}
        onEditEvent={onEditEvent}
        onViewEvent={onViewEvent}
        onCreateEvent={onCreateEvent}
        onDeleteEvent={onDeleteEvent}
        onManageAttendees={onSelectEvent}
      />

      <MembersSection
        members={clubMembers}
        isLoading={isLoading}
      />
    </>
  );
};

export default ClubAdminContent;
