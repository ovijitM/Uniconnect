
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AvailableClubs from '@/components/student/AvailableClubs';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import StudentClubs from '@/components/student/StudentClubs';
import RegisteredEvents from '@/components/student/RegisteredEvents';

interface OverviewTabContentProps {
  clubs: any[];
  events: any[];
  joinedClubs: any[];
  joinedClubIds: string[];
  registeredEvents: any[];
  registeredEventIds: string[];
  isLoading: boolean;
  onJoinClub: (clubId: string) => Promise<void>;
  onLeaveClub: (clubId: string) => Promise<void>;
  registerForEvent: (eventId: string) => void;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  clubs,
  events,
  joinedClubs,
  joinedClubIds,
  registeredEvents,
  registeredEventIds,
  isLoading,
  onJoinClub,
  onLeaveClub,
  registerForEvent
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Events
            </h2>
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
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Your Clubs
            </h2>
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
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Discover Clubs
            </h2>
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
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Your Events
            </h2>
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
    </div>
  );
};

export default OverviewTabContent;
