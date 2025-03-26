
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ExternalLink, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface RegisteredEventsProps {
  events: any[];
  isLoading: boolean;
  onUnregister?: (eventId: string) => void;
}

const RegisteredEvents: React.FC<RegisteredEventsProps> = ({ events, isLoading, onUnregister }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const handleUnregister = (eventId: string, eventTitle: string) => {
    if (!onUnregister) {
      toast({
        title: "Action not available",
        description: "Unable to unregister at this time.",
        variant: "destructive",
      });
      return;
    }
    
    // Confirm before unregistering
    if (window.confirm(`Are you sure you want to unregister from ${eventTitle}?`)) {
      onUnregister(eventId);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Events</CardTitle>
        <CardDescription>Events you've registered for</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
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
                </div>
                <div className="flex space-x-2">
                  {onUnregister && event.status === 'upcoming' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleUnregister(event.id, event.title)}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You haven't registered for any events yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegisteredEvents;
