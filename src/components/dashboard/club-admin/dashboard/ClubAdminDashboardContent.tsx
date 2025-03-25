
import React from 'react';
import NoClubsViewWrapper from './views/NoClubsView';
import EventsView from './views/EventsView';
import ClubsView from './views/ClubsView';
import MembersView from './views/MembersView';
import AttendanceView from './views/AttendanceView';
import ProfileView from './views/ProfileView';
import OverviewView from './views/OverviewView';
import { ClubFormData, EventFormData } from '@/hooks/club-admin/types';

interface ClubAdminDashboardContentProps {
  currentView: 'overview' | 'events' | 'clubs' | 'members' | 'attendance' | 'profile';
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
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (open: boolean) => void;
  eventFormData: EventFormData;
  handleEventInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCreateEvent: () => void;
  handleViewEvent: (eventId: string) => void;
  handleEditEvent: (eventId: string) => void;
  handleRefreshAfterDelete: () => void;
  fetchClubAdminData: () => Promise<void>;
  selectEventForAttendeeManagement: (eventId: string, eventTitle: string) => void;
  handleClubFileUpload?: (url: string, fileName: string) => void;
  handleEventFileUpload?: (url: string, fileName: string) => void;
}

const ClubAdminDashboardContent: React.FC<ClubAdminDashboardContentProps> = ({
  currentView,
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
  isEventDialogOpen,
  setIsEventDialogOpen,
  eventFormData,
  handleEventInputChange,
  handleCreateEvent,
  handleViewEvent,
  handleEditEvent,
  handleRefreshAfterDelete,
  fetchClubAdminData,
  selectEventForAttendeeManagement,
  handleClubFileUpload,
  handleEventFileUpload
}) => {
  if (adminClubs.length === 0 && !isLoading) {
    return (
      <NoClubsViewWrapper 
        isClubDialogOpen={isClubDialogOpen}
        setIsClubDialogOpen={setIsClubDialogOpen}
        clubFormData={clubFormData}
        handleClubInputChange={handleClubInputChange}
        handleCreateClub={handleCreateClub}
        handleClubFileUpload={handleClubFileUpload}
      />
    );
  }

  switch (currentView) {
    case 'events':
      return (
        <EventsView 
          events={clubEvents}
          isLoading={isLoading}
          onEditEvent={handleEditEvent}
          onViewEvent={handleViewEvent}
          onCreateEvent={() => setIsEventDialogOpen(true)}
          onDeleteEvent={handleRefreshAfterDelete}
          onManageAttendees={selectEventForAttendeeManagement}
          isEventDialogOpen={isEventDialogOpen}
          setIsEventDialogOpen={setIsEventDialogOpen}
          eventFormData={eventFormData}
          handleEventInputChange={handleEventInputChange}
          handleCreateEvent={handleCreateEvent}
          handleEventFileUpload={handleEventFileUpload}
          clubs={adminClubs}
        />
      );
    
    case 'clubs':
      return (
        <ClubsView 
          clubs={adminClubs}
          isLoading={isLoading}
          onRefresh={fetchClubAdminData}
          isClubDialogOpen={isClubDialogOpen}
          setIsClubDialogOpen={setIsClubDialogOpen}
          clubFormData={clubFormData}
          handleClubInputChange={handleClubInputChange}
          handleCreateClub={handleCreateClub}
          handleClubFileUpload={handleClubFileUpload}
        />
      );
    
    case 'members':
      return (
        <MembersView 
          members={clubMembers}
          isLoading={isLoading}
        />
      );
    
    case 'attendance':
      return (
        <AttendanceView 
          events={clubEvents}
          isLoading={isLoading}
          selectedEventId={selectedEventId}
          selectedEventTitle={selectedEventTitle}
          onEditEvent={handleEditEvent}
          onViewEvent={handleViewEvent}
          onCreateEvent={() => setIsEventDialogOpen(true)}
          onDeleteEvent={handleRefreshAfterDelete}
          onManageAttendees={selectEventForAttendeeManagement}
        />
      );
    
    case 'profile':
      return (
        <ProfileView 
          clubs={adminClubs}
          isLoading={isLoading}
          onRefresh={fetchClubAdminData}
          onCreateClub={() => setIsClubDialogOpen(true)}
          clubFormData={clubFormData}
          handleClubInputChange={handleClubInputChange}
          handleCreateClub={handleCreateClub}
          handleClubFileUpload={handleClubFileUpload}
          isClubDialogOpen={isClubDialogOpen}
          setIsClubDialogOpen={setIsClubDialogOpen}
        />
      );
    
    default:
      return (
        <OverviewView 
          adminClubs={adminClubs}
          clubEvents={clubEvents}
          clubMembers={clubMembers}
          activeEventCount={activeEventCount}
          pastEventCount={pastEventCount}
          totalMembersCount={totalMembersCount}
          averageAttendance={averageAttendance}
          isLoading={isLoading}
          selectedEventId={selectedEventId}
          selectedEventTitle={selectedEventTitle}
          isClubDialogOpen={isClubDialogOpen}
          setIsClubDialogOpen={setIsClubDialogOpen}
          clubFormData={clubFormData}
          handleClubInputChange={handleClubInputChange}
          handleCreateClub={handleCreateClub}
          handleClubFileUpload={handleClubFileUpload}
          isEventDialogOpen={isEventDialogOpen}
          setIsEventDialogOpen={setIsEventDialogOpen}
          eventFormData={eventFormData}
          handleEventInputChange={handleEventInputChange}
          handleCreateEvent={handleCreateEvent}
          handleEventFileUpload={handleEventFileUpload}
          handleViewEvent={handleViewEvent}
          handleEditEvent={handleEditEvent}
          handleRefreshAfterDelete={handleRefreshAfterDelete}
          fetchClubAdminData={fetchClubAdminData}
          selectEventForAttendeeManagement={selectEventForAttendeeManagement}
        />
      );
  }
};

export default ClubAdminDashboardContent;
