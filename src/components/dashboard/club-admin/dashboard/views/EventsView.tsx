
import React from 'react';
import EventsTable from '@/components/dashboard/EventsTable';

interface EventsViewProps {
  events: any[];
  isLoading: boolean;
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
  onCreateEvent: () => void;
  onDeleteEvent: (eventId: string) => void;
  onManageAttendees: (eventId: string, eventTitle: string) => void;
}

const EventsView: React.FC<EventsViewProps> = ({
  events,
  isLoading,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
  onDeleteEvent,
  onManageAttendees
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Events</h1>
      <EventsTable 
        events={events}
        isLoading={isLoading}
        onEditEvent={onEditEvent}
        onViewEvent={onViewEvent}
        onCreateEvent={onCreateEvent}
        onDeleteEvent={onDeleteEvent}
        onManageAttendees={onManageAttendees}
      />
    </div>
  );
};

export default EventsView;
