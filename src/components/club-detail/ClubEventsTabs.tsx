
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';

interface ClubEventsTabsProps {
  events: Event[];
}

const ClubEventsTabs: React.FC<ClubEventsTabsProps> = ({ events }) => {
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'past');

  return (
    <Tabs defaultValue="upcoming" className="mb-6">
      <TabsList className="grid w-full max-w-xs grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        <TabsTrigger value="past">Past Events</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="mt-6">
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">
              Check back later for new events from this club.
            </p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="past" className="mt-6">
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No past events</h3>
            <p className="text-muted-foreground">
              This club hasn't organized any events yet.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ClubEventsTabs;
