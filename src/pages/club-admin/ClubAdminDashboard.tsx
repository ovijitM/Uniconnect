
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardContent from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardContent';
import { useClubAdminData } from '@/hooks/club-admin/useClubAdminData';
import { useClubAdminForms } from '@/hooks/club-admin/useClubAdminForms';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminRoutes } from '@/components/dashboard/club-admin/dashboard/useClubAdminRoutes';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentView = 'overview' } = useClubAdminRoutes();

  const {
    adminClubs = [],
    clubEvents = [],
    clubMembers = [],
    activeEventCount = 0,
    pastEventCount = 0,
    totalMembersCount = 0,
    averageAttendance = 0,
    isLoading = false,
    fetchClubAdminData = async () => {},
    selectedEventId = null,
    selectedEventTitle = '',
    selectEventForAttendeeManagement = () => {}
  } = useClubAdminData(user?.id);

  const {
    eventFormData = {
      title: '',
      description: '',
      date: '',
      location: '',
      category: '',
      maxParticipants: '',
      clubId: '',
      imageUrl: '',
      tagline: '',
      eventType: 'in-person',
      registrationDeadline: '',
      onlinePlatform: '',
      eligibility: '',
      teamSize: '',
      registrationLink: '',
      entryFee: 'Free',
      theme: '',
      subTracks: '',
      prizePool: '',
      prizeCategories: '',
      additionalPerks: '',
      judgingCriteria: '',
      judges: '',
      deliverables: '',
      submissionPlatform: '',
      mentors: '',
      sponsors: '',
      contactEmail: '',
      communityLink: '',
      eventWebsite: '',
      eventHashtag: ''
    },
    isEventDialogOpen = false,
    setIsEventDialogOpen = () => {},
    clubFormData = {
      name: '',
      description: '',
      category: '',
      logoUrl: '',
      university: '',
      tagline: '',
      establishedYear: '',
      affiliation: '',
      whyJoin: '',
      regularEvents: '',
      signatureEvents: '',
      communityEngagement: '',
      whoCanJoin: '',
      membershipFee: '',
      howToJoin: '',
      presidentName: '',
      presidentContact: '',
      executiveMembers: '',
      advisors: '',
      phoneNumber: '',
      website: '',
      facebookLink: '',
      instagramLink: '',
      twitterLink: '',
      discordLink: '',
      documentUrl: '',
      documentName: ''
    },
    isClubDialogOpen = false,
    setIsClubDialogOpen = () => {},
    handleCreateClub = async () => {},
    handleCreateEvent = async () => {},
    handleEventInputChange = () => {},
    handleClubInputChange = () => {},
    handleClubFileUpload = () => {},
    handleEventFileUpload = () => {}
  } = useClubAdminForms(user?.id, fetchClubAdminData);

  // Basic navigation handlers
  const handleViewEvent = (eventId: string) => {
    window.location.href = `/events/${eventId}`;
  };

  const handleEditEvent = (eventId: string) => {
    console.log('Edit event:', eventId);
  };

  const handleRefreshAfterDelete = () => {
    fetchClubAdminData();
  };

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <Routes>
        <Route path="/*" element={
          <ClubAdminDashboardContent 
            currentView={currentView}
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
            isEventDialogOpen={isEventDialogOpen}
            setIsEventDialogOpen={setIsEventDialogOpen}
            eventFormData={eventFormData}
            handleEventInputChange={handleEventInputChange}
            handleCreateEvent={handleCreateEvent}
            handleViewEvent={handleViewEvent}
            handleEditEvent={handleEditEvent}
            handleRefreshAfterDelete={handleRefreshAfterDelete}
            fetchClubAdminData={fetchClubAdminData}
            selectEventForAttendeeManagement={selectEventForAttendeeManagement}
            handleClubFileUpload={handleClubFileUpload}
          />
        } />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
