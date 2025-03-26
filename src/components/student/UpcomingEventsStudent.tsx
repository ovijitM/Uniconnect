
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
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
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you can attend</CardDescription>
          </div>
          {events.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm" 
              onClick={() => navigate('/student-dashboard/events')}
            >
              More <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="flex items-center p-3 hover:bg-secondary/20 rounded-lg transition-colors">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Organized by: {event.clubs?.name || 'Unknown Club'}
                  </p>
                </div>
                <Button 
                  variant={registeredEventIds.includes(event.id) ? "secondary" : "outline"}
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
