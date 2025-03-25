
import React from 'react';
import ClubAdminHeader from '@/components/dashboard/ClubAdminHeader';
import ClubAdminContent from '@/components/dashboard/ClubAdminContent';
import { ClubFormData, EventFormData } from '@/hooks/club-admin/types';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OverviewViewProps {
  adminClubs: any[];
  clubEvents: any[];
  clubMembers: any[];
  activeEventCount: number;
  pastEventCount: number;
  totalMembersCount: number;
  averageAttendance: number;
  isLoading: boolean;
  selectedEventId: string | null;
  selectedEventTitle: string;
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
  handleClubFileUpload?: (url: string, fileName: string) => void;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (open: boolean) => void;
  eventFormData: EventFormData;
  handleEventInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCreateEvent: () => void;
  handleEventFileUpload?: (url: string, fileName: string) => void;
  handleViewEvent: (eventId: string) => void;
  handleEditEvent: (eventId: string) => void;
  handleRefreshAfterDelete: () => void;
  fetchClubAdminData: () => Promise<void>;
  selectEventForAttendeeManagement: (eventId: string, eventTitle: string) => void;
}

const OverviewView: React.FC<OverviewViewProps> = ({
  adminClubs,
  clubEvents,
  clubMembers,
  activeEventCount,
  pastEventCount,
  totalMembersCount,
  averageAttendance,
  isLoading,
  selectedEventId,
  selectedEventTitle,
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub,
  handleClubFileUpload,
  isEventDialogOpen,
  setIsEventDialogOpen,
  eventFormData,
  handleEventInputChange,
  handleCreateEvent,
  handleEventFileUpload,
  handleViewEvent,
  handleEditEvent,
  handleRefreshAfterDelete,
  fetchClubAdminData,
  selectEventForAttendeeManagement
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Welcome card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Welcome to your Club Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage your clubs, events, and members all in one place. Use the sidebar navigation to explore different sections.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4">
          <ClubAdminContent 
            activeEventCount={activeEventCount}
            totalMembersCount={totalMembersCount}
            pastEventCount={pastEventCount}
            averageAttendance={averageAttendance}
            clubEvents={clubEvents}
            adminClubs={adminClubs}
            clubMembers={clubMembers}
            isLoading={isLoading}
            onEditEvent={handleEditEvent}
            onViewEvent={handleViewEvent}
            onCreateEvent={() => setIsEventDialogOpen(true)}
            onDeleteEvent={handleRefreshAfterDelete}
            onRefreshData={fetchClubAdminData}
            selectedEventId={selectedEventId}
            selectedEventTitle={selectedEventTitle}
            onSelectEvent={selectEventForAttendeeManagement}
          />
        </TabsContent>
        
        <TabsContent value="clubs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminClubs.map((club) => (
              <Card key={club.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base truncate">{club.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">{club.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Members: {clubMembers.filter(member => member.club_id === club.id).length}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubEvents.slice(0, 6).map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base truncate">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 h-10">{event.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Separator />
      
      {/* Hidden dialogs for creating entities */}
      <ClubAdminHeader 
        isClubDialogOpen={isClubDialogOpen}
        setIsClubDialogOpen={setIsClubDialogOpen}
        clubFormData={clubFormData}
        onClubInputChange={handleClubInputChange}
        onCreateClub={handleCreateClub}
        onClubFileUpload={handleClubFileUpload}
        isEventDialogOpen={isEventDialogOpen}
        setIsEventDialogOpen={setIsEventDialogOpen}
        eventFormData={eventFormData}
        clubs={adminClubs}
        onEventInputChange={handleEventInputChange}
        onCreateEvent={handleCreateEvent}
        onEventFileUpload={handleEventFileUpload}
      />
    </div>
  );
};

export default OverviewView;
