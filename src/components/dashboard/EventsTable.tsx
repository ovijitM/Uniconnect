
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, PlusCircle, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEventDeletion } from '@/hooks/club-admin/useEventDeletion';

interface EventsTableProps {
  events: any[];
  isLoading: boolean;
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
  onCreateEvent: () => void;
  onDeleteEvent?: (eventId: string) => void;
  onManageAttendees?: (eventId: string, eventTitle: string) => void;
}

const EventsTable: React.FC<EventsTableProps> = ({
  events,
  isLoading,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
  onDeleteEvent,
  onManageAttendees
}) => {
  const { toast } = useToast();
  const { openDeleteConfirmation, DeleteConfirmationDialog } = useEventDeletion(
    () => {
      if (onDeleteEvent) {
        // This is just to trigger a refresh in the parent component
        onDeleteEvent('refresh');
      }
    }
  );

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

  const handleDeleteClick = (eventId: string) => {
    if (onDeleteEvent) {
      openDeleteConfirmation(eventId);
    }
  };

  const handleManageAttendeesClick = (eventId: string, eventTitle: string) => {
    if (onManageAttendees) {
      onManageAttendees(eventId, eventTitle);
    }
  };

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage all your club events</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ) : events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : event.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </TableCell>
                    <TableCell>{event.event_participants[0]?.count || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditEvent(event.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewEvent(event.id)}
                        >
                          View
                        </Button>
                        {onManageAttendees && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageAttendeesClick(event.id, event.title)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Attendees
                          </Button>
                        )}
                        {onDeleteEvent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(event.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No events found</p>
              <Button 
                variant="outline"
                className="mt-4"
                onClick={onCreateEvent}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Render the confirmation dialog */}
      <DeleteConfirmationDialog />
    </div>
  );
};

export default EventsTable;
