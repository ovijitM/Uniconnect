
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Clock, Info, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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
  const navigate = useNavigate();
  
  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Your student dashboard at a glance</p>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading data</AlertTitle>
          <AlertDescription>
            {error}
            {refreshData && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => refreshData()}
              >
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <>
      <div className="mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">Your student dashboard at a glance</p>
      </div>

      <StatCards 
        registeredEvents={registeredEvents}
        joinedClubs={joinedClubs}
        clubs={clubs}
        joinedClubIds={joinedClubIds}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Button 
              variant="ghost" 
              className="text-sm" 
              onClick={() => navigate('/student-dashboard/events')}
            >
              See all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Card className="overflow-hidden border-none shadow-md">
            <CardContent className="p-0">
              <UpcomingEventsStudent 
                events={events.slice(0, 3)}
                registeredEventIds={registeredEventIds}
                isLoading={isLoading}
                onRegisterEvent={registerForEvent}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Clubs</h2>
            <Button 
              variant="ghost" 
              className="text-sm" 
              onClick={() => navigate('/student-dashboard/clubs')}
            >
              See all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <Card className="overflow-hidden border-none shadow-md">
            <CardContent className="p-0">
              <StudentClubs 
                clubs={joinedClubs.slice(0, 3)}
                isLoading={isLoading}
                onLeaveClub={onLeaveClub}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Discover Clubs</h2>
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-0">
                <AvailableClubs 
                  clubs={clubs.filter(club => !joinedClubIds.includes(club.id)).slice(0, 4)}
                  joinedClubIds={joinedClubIds}
                  isLoading={isLoading}
                  onJoinClub={onJoinClub}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-7">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Your Events</h2>
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-0">
                <RegisteredEvents 
                  events={registeredEvents.slice(0, 4)}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardOverview;
