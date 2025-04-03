import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  Clock, 
  Info, 
  ArrowRight, 
  AlertCircle, 
  Bell,
  Newspaper,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import AvailableClubs from '@/components/student/AvailableClubs';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import StudentClubs from '@/components/student/StudentClubs';
import RegisteredEvents from '@/components/student/RegisteredEvents';
import { StatCards } from './StatCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import SocialFeedWidget from '@/components/student/SocialFeedWidget';
import DashboardGreeting from '@/components/dashboard/shared/DashboardGreeting';

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
  const { posts, isLoading: isLoadingPosts, refreshFeed } = useSocialFeed(user?.id);
  
  if (error) {
    return (
      <div className="space-y-6">
        <DashboardGreeting 
          userName={user?.name || 'Student'} 
          subtitle="Your student dashboard at a glance"
          hasError={true}
        />
        
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

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="social">Social Feed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
                  <Bell className="h-5 w-5 mr-2 text-primary" />
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
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
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
        </TabsContent>
        
        <TabsContent value="clubs">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">My Clubs</h2>
              <StudentClubs 
                clubs={joinedClubs}
                isLoading={isLoading}
                onLeaveClub={onLeaveClub}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">My Events</h2>
              <RegisteredEvents 
                events={registeredEvents}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Newspaper className="h-5 w-5 mr-2 text-primary" />
                Social Feed
              </h2>
              <SocialFeedWidget 
                posts={posts} 
                isLoading={isLoadingPosts}
                userId={user?.id}
                refreshFeed={refreshFeed}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default StudentDashboardOverview;
