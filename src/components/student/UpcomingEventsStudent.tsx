
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface UpcomingEventsStudentProps {
  events: any[];
  registeredEventIds: string[];
  isLoading: boolean;
  onRegisterEvent: (eventId: string) => void;
}

const UpcomingEventsStudent: React.FC<UpcomingEventsStudentProps> = ({
  events,
  registeredEventIds,
  isLoading,
  onRegisterEvent
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Events you can attend</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Organized by: {event.clubs?.name || 'Unknown Club'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onRegisterEvent(event.id)}
                  disabled={registeredEventIds.includes(event.id)}
                >
                  {registeredEventIds.includes(event.id) ? 'Registered' : 'Register'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming events available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsStudent;
