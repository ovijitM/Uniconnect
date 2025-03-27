
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useMatch } from 'react-router-dom';
import { useStudentData } from '@/hooks/useStudentData';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import StudentSidebar from '@/components/dashboard/student/StudentSidebar';
import StudentDashboardOverview from '@/components/student/dashboard/StudentDashboardOverview';
import StudentEventsView from '@/components/student/dashboard/StudentEventsView';
import StudentClubsView from '@/components/student/dashboard/StudentClubsView';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ui/error-boundary';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    error,
    clubs, 
    events, 
    joinedClubs, 
    registeredEvents,
    registeredEventIds,
    joinClub, 
    leaveClub,
    registerForEvent,
    unregisterFromEvent,
    refreshData
  } = useStudentData();
  
  // Match patterns for different routes
  const isOverview = useMatch('/student-dashboard');
  const isEventsPage = useMatch('/student-dashboard/events');
  const isClubsPage = useMatch('/student-dashboard/clubs');
  
  // Redirect if not logged in or not a student
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'student') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  const joinedClubIds = joinedClubs.map(club => club.id);

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

  // Render error state if there is an error
  if (error && !isLoading) {
    return (
      <DashboardLayout sidebar={<StudentSidebar />}>
        <div className="container max-w-full px-4 py-6">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading dashboard</AlertTitle>
            <AlertDescription>
              {error}
              {refreshData && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => refreshData()}
                >
                  Refresh Data
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

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
        registeredEventIds={registeredEventIds || []}
        isLoading={isLoading}
        error={error}
        onJoinClub={handleJoinClub}
        onLeaveClub={handleLeaveClub}
        registerForEvent={registerForEvent}
        refreshData={refreshData}
      />
    );
  };

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <ErrorBoundary
        onReset={() => {
          if (refreshData) refreshData();
        }}
      >
        <div className="container max-w-full px-0">
          {renderContent()}
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default StudentDashboard;
