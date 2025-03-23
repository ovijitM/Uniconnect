
import React from 'react';
import EventsTable from '@/components/dashboard/EventsTable';
import AttendeeManagement from '@/components/dashboard/AttendeeManagement';

interface AttendanceViewProps {
  events: any[];
  isLoading: boolean;
  selectedEventId: string | null;
  selectedEventTitle: string;
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
  onCreateEvent: () => void;
  onDeleteEvent: (eventId: string) => void;
  onManageAttendees: (eventId: string, eventTitle: string) => void;
}

const AttendanceView: React.FC<AttendanceViewProps> = ({
  events,
  isLoading,
  selectedEventId,
  selectedEventTitle,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
  onDeleteEvent,
  onManageAttendees
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance Management</h1>
      {events.length > 0 ? (
        <>
          <p className="text-muted-foreground mb-4">Select an event to manage attendance</p>
          <EventsTable 
            events={events}
            isLoading={isLoading}
            onEditEvent={onEditEvent}
            onViewEvent={onViewEvent}
            onCreateEvent={onCreateEvent}
            onDeleteEvent={onDeleteEvent}
            onManageAttendees={onManageAttendees}
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
            onClick={onCreateEvent}
            className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create Event
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
