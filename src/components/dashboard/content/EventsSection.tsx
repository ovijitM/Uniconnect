
import React from 'react';
import EventsTable from '../EventsTable';

interface EventsSectionProps {
  events: any[];
  isLoading: boolean;
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
  onCreateEvent: () => void;
  onDeleteEvent: (eventId: string) => void;
  onManageAttendees: (eventId: string, eventTitle: string) => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  isLoading,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
  onDeleteEvent,
  onManageAttendees
}) => {
  return (
    <EventsTable
      events={events}
      isLoading={isLoading}
      onEditEvent={onEditEvent}
      onViewEvent={onViewEvent}
      onCreateEvent={onCreateEvent}
      onDeleteEvent={onDeleteEvent}
      onManageAttendees={onManageAttendees}
    />
  );
};

export default EventsSection;
