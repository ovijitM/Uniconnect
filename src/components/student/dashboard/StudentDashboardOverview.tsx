
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AvailableClubs from '@/components/student/AvailableClubs';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import StudentClubs from '@/components/student/StudentClubs';
import RegisteredEvents from '@/components/student/RegisteredEvents';
import { StatCards } from './StatCards';

interface StudentDashboardOverviewProps {
  user: any;
  clubs: any[];
  events: any[];
  joinedClubs: any[];
  registeredEvents: any[];
  joinedClubIds: string[];
  registeredEventIds: string[];
  isLoading: boolean;
  onJoinClub: (clubId: string) => Promise<void>;
  onLeaveClub: (clubId: string) => Promise<void>;
  registerForEvent: (eventId: string) => void;
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
  onJoinClub,
  onLeaveClub,
  registerForEvent
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}</p>
      </div>

      <StatCards 
        registeredEvents={registeredEvents}
        joinedClubs={joinedClubs}
        clubs={clubs}
        joinedClubIds={joinedClubIds}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <UpcomingEventsStudent 
          events={events}
          registeredEventIds={registeredEventIds}
          isLoading={isLoading}
          onRegisterEvent={registerForEvent}
        />

        <StudentClubs 
          clubs={joinedClubs}
          isLoading={isLoading}
          onLeaveClub={onLeaveClub}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AvailableClubs 
          clubs={clubs.filter(club => !joinedClubIds.includes(club.id))}
          joinedClubIds={joinedClubIds}
          isLoading={isLoading}
          onJoinClub={onJoinClub}
        />
        
        <div className="lg:col-span-2">
          <RegisteredEvents 
            events={registeredEvents}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default StudentDashboardOverview;
