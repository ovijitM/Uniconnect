
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardContent from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardContent';
import { useClubAdminDashboard } from '@/hooks/club-admin/dashboard/useClubAdminDashboard';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'overview' | 'events' | 'clubs' | 'members' | 'attendance' | 'profile'>('overview');
  
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

  // Set the current view based on the URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/events')) {
      setCurrentView('events');
    } else if (path.includes('/clubs')) {
      setCurrentView('clubs');
    } else if (path.includes('/members')) {
      setCurrentView('members');
    } else if (path.includes('/attendance')) {
      setCurrentView('attendance');
    } else if (path.includes('/profile')) {
      setCurrentView('profile');
    } else {
      setCurrentView('overview');
    }
  }, [location]);

  // Fetch data when the component mounts
  useEffect(() => {
    console.log("ClubAdminDashboard: Fetching data on mount");
    fetchClubAdminData();
  }, []);

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container p-6">
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
          handleEventFileUpload={handleEventFileUpload}
          isLoadingProfile={isLoadingProfile}
          profileError={profileError}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
