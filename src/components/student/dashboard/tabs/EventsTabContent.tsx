
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RegisteredEvents from '@/components/student/RegisteredEvents';

interface EventsTabContentProps {
  registeredEvents: any[];
  isLoading: boolean;
}

const EventsTabContent: React.FC<EventsTabContentProps> = ({
  registeredEvents,
  isLoading
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">My Events</h2>
        <RegisteredEvents 
          events={registeredEvents}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default EventsTabContent;
