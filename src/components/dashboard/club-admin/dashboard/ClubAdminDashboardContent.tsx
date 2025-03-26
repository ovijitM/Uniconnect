
import React from 'react';
import { ClubFormData, EventFormData } from '@/hooks/club-admin/types';
import QuickViewSection from '@/components/dashboard/content/QuickViewSection';
import EventsSection from '@/components/dashboard/content/EventsSection';
import ClubsSection from '@/components/dashboard/content/ClubsSection';
import MembersSection from '@/components/dashboard/content/MembersSection';
import AttendeeSection from '@/components/dashboard/content/AttendeeSection';
import ClubProfileSettings from '@/components/dashboard/ClubProfileSettings';
import ClubAdminHeader from '@/components/dashboard/ClubAdminHeader';
import NoClubsView from '@/components/dashboard/NoClubsView';

export interface ClubAdminDashboardContentProps {
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
  selectedEventTitle: string | null;
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
  fetchClubAdminData: () => void;
  selectEventForAttendeeManagement: (eventId: string, eventTitle: string) => void;
  handleClubFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  handleEventFileUpload?: (url: string, fileName: string) => void;
  isLoadingProfile?: boolean;
  profileError?: string | null;
  handleRetryProfileFetch?: () => void;
  handleCreateClubClick: () => void;
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
  handleEventFileUpload,
  isLoadingProfile,
  profileError,
  handleRetryProfileFetch,
  handleCreateClubClick
}) => {
  // Show the NoClubsView if there are no clubs and not loading
  if (adminClubs.length === 0 && !isLoading && currentView !== 'profile') {
    return (
      <NoClubsView 
        onCreateClub={handleCreateClubClick}
        isClubDialogOpen={isClubDialogOpen}
        setIsClubDialogOpen={setIsClubDialogOpen}
        clubFormData={clubFormData}
        onClubInputChange={handleClubInputChange}
        onCreateClubSubmit={handleCreateClub}
        onClubFileUpload={handleClubFileUpload}
        isLoadingProfile={isLoadingProfile}
        profileError={profileError}
        onRetryProfileFetch={handleRetryProfileFetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ClubAdminHeader
        isClubDialogOpen={isClubDialogOpen}
        setIsClubDialogOpen={setIsClubDialogOpen}
        clubFormData={clubFormData}
        onClubInputChange={handleClubInputChange}
        onCreateClub={handleCreateClub}
        isEventDialogOpen={isEventDialogOpen}
        setIsEventDialogOpen={setIsEventDialogOpen}
        eventFormData={eventFormData}
        clubs={adminClubs}
        onEventInputChange={handleEventInputChange}
        onCreateEvent={handleCreateEvent}
        onClubFileUpload={handleClubFileUpload}
        onEventFileUpload={handleEventFileUpload}
      />

      {currentView === 'overview' && (
        <QuickViewSection
          activeEventCount={activeEventCount}
          pastEventCount={pastEventCount}
          totalMembersCount={totalMembersCount}
          averageAttendance={averageAttendance}
          isLoading={isLoading}
          clubs={adminClubs}
          events={clubEvents.slice(0, 5)}
          onViewEvent={handleViewEvent}
        />
      )}

      {currentView === 'events' && (
        <EventsSection
          events={clubEvents}
          isLoading={isLoading}
          onViewEvent={handleViewEvent}
          onEditEvent={handleEditEvent}
          onRefresh={handleRefreshAfterDelete}
          onCreateEvent={() => setIsEventDialogOpen(true)}
        />
      )}

      {currentView === 'clubs' && (
        <ClubsSection
          clubs={adminClubs}
          isLoading={isLoading}
          onRefresh={fetchClubAdminData}
        />
      )}

      {currentView === 'members' && (
        <MembersSection
          members={clubMembers}
          isLoading={isLoading}
          onRefresh={fetchClubAdminData}
        />
      )}

      {currentView === 'attendance' && selectedEventId && (
        <AttendeeSection
          eventId={selectedEventId}
          eventTitle={selectedEventTitle || 'Event'}
          onSelectEvent={selectEventForAttendeeManagement}
          events={clubEvents}
        />
      )}

      {currentView === 'profile' && (
        <ClubProfileSettings />
      )}
    </div>
  );
};

export default ClubAdminDashboardContent;
