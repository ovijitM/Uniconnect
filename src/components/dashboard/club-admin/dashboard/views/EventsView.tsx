
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import EventsTable from '@/components/dashboard/EventsTable';
import { EventFormData } from '@/hooks/club-admin/types';

interface EventsViewProps {
  events: any[];
  isLoading: boolean;
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
  onCreateEvent: () => void;
  onDeleteEvent: (eventId: string) => void;
  onManageAttendees: (eventId: string, eventTitle: string) => void;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (open: boolean) => void;
  eventFormData: EventFormData;
  handleEventInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCreateEvent: () => void;
  handleEventFileUpload?: (url: string, fileName: string) => void;
  clubs: any[];
}

const EventsView: React.FC<EventsViewProps> = ({
  events,
  isLoading,
  onEditEvent,
  onViewEvent,
  onCreateEvent,
  onDeleteEvent,
  onManageAttendees,
  isEventDialogOpen,
  setIsEventDialogOpen,
  eventFormData,
  handleEventInputChange,
  handleCreateEvent,
  handleEventFileUpload,
  clubs
}) => {
  const [activeTab, setActiveTab] = useState('all');
  
  const currentDate = new Date();
  
  // Filter events by status
  const upcomingEvents = events.filter(event => new Date(event.date) > currentDate);
  const pastEvents = events.filter(event => new Date(event.date) <= currentDate);
  
  // Get the events to display based on active tab
  const getDisplayEvents = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingEvents;
      case 'past':
        return pastEvents;
      default:
        return events;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <Button onClick={() => setIsEventDialogOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Event
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingEvents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Past Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastEvents.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Events List</CardTitle>
          <CardDescription>Manage all your club events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <EventsTable
                events={getDisplayEvents()}
                isLoading={isLoading}
                onEditEvent={onEditEvent}
                onViewEvent={onViewEvent}
                onCreateEvent={onCreateEvent}
                onDeleteEvent={onDeleteEvent}
                onManageAttendees={onManageAttendees}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsView;
