
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useClubAdminData } from '@/hooks/useClubAdminData';
import { useClubAdminForms } from '@/hooks/useClubAdminForms';

// Components
import ClubAdminHeader from '@/components/dashboard/ClubAdminHeader';
import ClubAdminContent from '@/components/dashboard/ClubAdminContent';
import NoClubsView from '@/components/dashboard/NoClubsView';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    adminClubs,
    clubEvents,
    clubMembers,
    activeEventCount,
    pastEventCount,
    totalMembersCount,
    averageAttendance,
    isLoading,
    fetchClubAdminData
  } = useClubAdminData(user?.id);

  const {
    eventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    clubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    handleCreateClub,
    handleCreateEvent,
    handleEventInputChange,
    handleClubInputChange
  } = useClubAdminForms(user?.id, fetchClubAdminData);

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {adminClubs.length === 0 && !isLoading ? (
            <NoClubsView 
              isDialogOpen={isClubDialogOpen}
              setIsDialogOpen={setIsClubDialogOpen}
              clubFormData={clubFormData}
              handleClubInputChange={handleClubInputChange}
              handleCreateClub={handleCreateClub}
            />
          ) : (
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
              />
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubAdminDashboard;
