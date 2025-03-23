
import React from 'react';
import ClubAdminHeader from '@/components/dashboard/ClubAdminHeader';
import ClubAdminContent from '@/components/dashboard/ClubAdminContent';
import { ClubFormData, EventFormData } from '@/hooks/club-admin/useClubAdminForms';

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
  isEventDialogOpen,
  setIsEventDialogOpen,
  eventFormData,
  handleEventInputChange,
  handleCreateEvent,
  handleViewEvent,
  handleEditEvent,
  handleRefreshAfterDelete,
  fetchClubAdminData,
  selectEventForAttendeeManagement
}) => {
  return (
    <>
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
      />

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
    </>
  );
};

export default OverviewView;
