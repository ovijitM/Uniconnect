
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useClubAdminDashboard } from '@/hooks/club-admin/dashboard/useClubAdminDashboard';
import { useClubAdminRoutes } from '@/components/dashboard/club-admin/dashboard/useClubAdminRoutes';

// Components
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardContent from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardContent';
import ClubAdminDashboardActions from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardActions';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentView } = useClubAdminRoutes();
  const {
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
    selectEventForAttendeeManagement,
    isLoadingProfile,
    profileError,
    handleRetryProfileFetch,
    handleCreateClubClick
  } = useClubAdminDashboard();

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') {
    toast({
      title: "Access Denied",
      description: "You don't have permissions for the club admin dashboard.",
      variant: "destructive",
    });
    return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;
  }

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="max-w-7xl mx-auto">
        <ClubAdminDashboardActions
          profileError={profileError}
          isLoadingProfile={isLoadingProfile}
          handleRetryProfileFetch={handleRetryProfileFetch}
          handleCreateClubClick={handleCreateClubClick}
          setIsEventDialogOpen={setIsEventDialogOpen}
        />
        
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
          isLoadingProfile={isLoadingProfile}
          profileError={profileError}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
