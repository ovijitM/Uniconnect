
import React from 'react';
import Layout from '@/components/Layout';
import { Outlet } from 'react-router-dom';
import PageTitle from '@/components/ui/page-title';
import { useClubAdminDashboard } from '@/hooks/club-admin/dashboard/useClubAdminDashboard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ClubAdminHeaderTabs from '@/components/dashboard/club-admin/ClubAdminHeaderTabs';
import ClubAdminHeader from '@/components/dashboard/ClubAdminHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import NoClubsView from '@/components/dashboard/club-admin/dashboard/views/NoClubsView';

const ClubAdminDashboard: React.FC = () => {
  const {
    user,
    adminClubs,
    clubEvents,
    isLoading,
    isEventDialogOpen,
    setIsEventDialogOpen,
    eventFormData,
    handleEventInputChange,
    handleCreateEvent,
    handleEventFileUpload,
    handleCreateClubClick,
    fetchClubAdminData,
    errorMessage
  } = useClubAdminDashboard();

  if (!user) {
    return (
      <Layout>
        <PageTitle>Club Admin Dashboard</PageTitle>
        <Card>
          <CardContent className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <PageTitle>Club Admin Dashboard</PageTitle>
        <Card>
          <CardContent className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <PageTitle>Club Admin Dashboard</PageTitle>

        <ClubAdminHeader
          onCreateClub={handleCreateClubClick}
          isEventDialogOpen={isEventDialogOpen}
          setIsEventDialogOpen={setIsEventDialogOpen}
          eventFormData={eventFormData}
          clubs={adminClubs}
          onEventInputChange={handleEventInputChange}
          onCreateEvent={handleCreateEvent}
          onEventFileUpload={handleEventFileUpload}
        />

        {adminClubs.length === 0 ? (
          <NoClubsView 
            onCreateClubClick={handleCreateClubClick}
            isLoading={isLoading}
            error={errorMessage}
            onRefresh={fetchClubAdminData}
          />
        ) : (
          <>
            <ClubAdminHeaderTabs />
            <div className="mt-4">
              <Outlet />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ClubAdminDashboard;
