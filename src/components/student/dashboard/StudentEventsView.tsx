
import React from 'react';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import RegisteredEvents from '@/components/student/RegisteredEvents';

interface StudentEventsViewProps {
  events: any[];
  registeredEvents: any[];
  registeredEventIds: string[];
  isLoading: boolean;
  registerForEvent: (eventId: string) => void;
}

const StudentEventsView: React.FC<StudentEventsViewProps> = ({
  events,
  registeredEvents,
  registeredEventIds,
  isLoading,
  registerForEvent
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Upcoming Events</h2>
          <UpcomingEventsStudent 
            events={events}
            registeredEventIds={registeredEventIds}
            isLoading={isLoading}
            onRegisterEvent={registerForEvent}
          />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-4">Registered Events</h2>
          <RegisteredEvents 
            events={registeredEvents}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentEventsView;
