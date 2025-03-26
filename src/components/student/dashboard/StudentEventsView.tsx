
import React from 'react';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import RegisteredEvents from '@/components/student/RegisteredEvents';

interface StudentEventsViewProps {
  events: any[];
  registeredEvents: any[];
  registeredEventIds: string[];
  isLoading: boolean;
  registerForEvent: (eventId: string) => void;
  unregisterFromEvent?: (eventId: string) => void;
}

const StudentEventsView: React.FC<StudentEventsViewProps> = ({
  events,
  registeredEvents,
  registeredEventIds,
  isLoading,
  registerForEvent,
  unregisterFromEvent
}) => {
  return (
    <div className="space-y-6">
      <div className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">My Events</h1>
        <p className="text-muted-foreground">Manage your event registrations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold px-2">Upcoming Events</h2>
          <UpcomingEventsStudent 
            events={events.filter(event => !registeredEventIds.includes(event.id))}
            registeredEventIds={registeredEventIds}
            isLoading={isLoading}
            onRegisterEvent={registerForEvent}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold px-2">Registered Events</h2>
          <RegisteredEvents 
            events={registeredEvents}
            isLoading={isLoading}
            onUnregister={unregisterFromEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentEventsView;
