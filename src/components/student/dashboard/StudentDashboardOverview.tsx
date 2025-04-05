
import React from 'react';
import DashboardGreeting from '@/components/dashboard/shared/DashboardGreeting';
import { StatCards } from './StatCards';
import DashboardTabs from './DashboardTabs';
import DashboardErrorState from './DashboardErrorState';

interface StudentDashboardOverviewProps {
  user: any;
  clubs: any[];
  events: any[];
  joinedClubs: any[];
  registeredEvents: any[];
  joinedClubIds: string[];
  registeredEventIds: string[];
  isLoading: boolean;
  error: string | null;
  onJoinClub: (clubId: string) => Promise<void>;
  onLeaveClub: (clubId: string) => Promise<void>;
  registerForEvent: (eventId: string) => void;
  refreshData?: () => void;
}

const StudentDashboardOverview: React.FC<StudentDashboardOverviewProps> = ({
  user,
  clubs,
  events,
  joinedClubs,
  registeredEvents,
  joinedClubIds,
  registeredEventIds,
  isLoading,
  error,
  onJoinClub,
  onLeaveClub,
  registerForEvent,
  refreshData
}) => {
  if (error) {
    return (
      <DashboardErrorState
        error={error}
        userName={user?.name || 'Student'}
        refreshData={refreshData}
      />
    );
  }
  
  return (
    <>
      <DashboardGreeting 
        userName={user?.name || 'Student'} 
        subtitle="Your student dashboard at a glance"
      />

      <StatCards 
        registeredEvents={registeredEvents}
        joinedClubs={joinedClubs}
        clubs={clubs}
        joinedClubIds={joinedClubIds}
        isLoading={isLoading}
      />

      <DashboardTabs
        user={user}
        clubs={clubs}
        events={events}
        joinedClubs={joinedClubs}
        joinedClubIds={joinedClubIds}
        registeredEvents={registeredEvents}
        registeredEventIds={registeredEventIds}
        isLoading={isLoading}
        onJoinClub={onJoinClub}
        onLeaveClub={onLeaveClub}
        registerForEvent={registerForEvent}
      />
    </>
  );
};

export default StudentDashboardOverview;
