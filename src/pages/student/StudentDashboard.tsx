
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useMatch } from 'react-router-dom';
import { useStudentData } from '@/hooks/useStudentData';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import StudentSidebar from '@/components/dashboard/student/StudentSidebar';
import StudentDashboardOverview from '@/components/student/dashboard/StudentDashboardOverview';
import StudentEventsView from '@/components/student/dashboard/StudentEventsView';
import StudentClubsView from '@/components/student/dashboard/StudentClubsView';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    clubs, 
    events, 
    joinedClubs, 
    registeredEvents, 
    joinClub, 
    leaveClub,
    registerForEvent,
    unregisterFromEvent
  } = useStudentData();
  
  // Match patterns for different routes
  const isOverview = useMatch('/student-dashboard');
  const isEventsPage = useMatch('/student-dashboard/events');
  const isClubsPage = useMatch('/student-dashboard/clubs');
  
  // Redirect if not logged in or not a student
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'student') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  const joinedClubIds = joinedClubs.map(club => club.id);
  const registeredEventIds = registeredEvents.map(event => event.id);

  // Create a wrapper function that properly handles the Promise<void> return type for joinClub
  const handleJoinClub = async (clubId: string): Promise<void> => {
    if (!joinClub) return Promise.resolve();
    return joinClub(clubId);
  };

  // Create a wrapper function for leaveClub
  const handleLeaveClub = async (clubId: string): Promise<void> => {
    if (!leaveClub) return Promise.resolve();
    return leaveClub(clubId);
  };

  // Render different content based on the current route
  const renderContent = () => {
    if (isEventsPage) {
      return (
        <StudentEventsView
          events={events}
          registeredEvents={registeredEvents}
          registeredEventIds={registeredEventIds}
          isLoading={isLoading}
          registerForEvent={registerForEvent}
          unregisterFromEvent={unregisterFromEvent}
        />
      );
    }

    if (isClubsPage) {
      return (
        <StudentClubsView
          clubs={clubs}
          joinedClubs={joinedClubs}
          joinedClubIds={joinedClubIds}
          isLoading={isLoading}
          onJoinClub={handleJoinClub}
          onLeaveClub={handleLeaveClub}
        />
      );
    }

    // Default overview page
    return (
      <StudentDashboardOverview
        user={user}
        clubs={clubs}
        events={events}
        joinedClubs={joinedClubs}
        registeredEvents={registeredEvents}
        joinedClubIds={joinedClubIds}
        registeredEventIds={registeredEventIds}
        isLoading={isLoading}
        onJoinClub={handleJoinClub}
        onLeaveClub={handleLeaveClub}
        registerForEvent={registerForEvent}
      />
    );
  };

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="container max-w-full px-0">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
