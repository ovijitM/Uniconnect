
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import { Skeleton } from '@/components/ui/skeleton';

interface UpcomingEventsSectionProps {
  events: Event[];
  isLoading: boolean;
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events, isLoading }) => {
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  
  console.log("UpcomingEventsSection - Total events:", events.length);
  console.log("UpcomingEventsSection - Upcoming events:", upcomingEvents.length);
  console.log("UpcomingEventsSection - Event IDs:", upcomingEvents.map(e => e.id));

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">Upcoming Events</h2>
        <Link to="/events">
          <Button variant="ghost" className="group">
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.slice(0, 3).map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-secondary/30 rounded-xl">
          <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
          <p className="text-muted-foreground">Check back later for new events.</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsSection;
