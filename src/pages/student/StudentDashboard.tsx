import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useMatch } from 'react-router-dom';
import { useStudentData } from '@/hooks/useStudentData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AvailableClubs from '@/components/student/AvailableClubs';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import StudentClubs from '@/components/student/StudentClubs';
import RegisteredEvents from '@/components/student/RegisteredEvents';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import StudentSidebar from '@/components/dashboard/student/StudentSidebar';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    isLoading, 
    clubs, 
    events, 
    joinedClubs, 
    registeredEvents, 
    joinClub, 
    registerForEvent 
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

  // Render different content based on the current route
  const renderContent = () => {
    if (isEventsPage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">My Events</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Upcoming Events</h2>
              <UpcomingEventsStudent 
                events={events}
                registeredEventIds={registeredEventIds}
                isLoading={isLoading}
                onRegisterEvent={registerForEvent}
              />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-4">Registered Events</h2>
              <RegisteredEvents 
                events={registeredEvents}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      );
    }

    if (isClubsPage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">My Clubs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Joined Clubs</h2>
              <StudentClubs 
                clubs={joinedClubs}
                isLoading={isLoading}
              />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-4">Available Clubs</h2>
              <AvailableClubs 
                clubs={clubs}
                joinedClubIds={joinedClubIds}
                isLoading={isLoading}
                onJoinClub={handleJoinClub}
              />
            </div>
          </div>
        </div>
      );
    }

    // Default overview page
    return (
      <>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
              <CardDescription>Events you've registered for</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
              ) : (
                <div className="text-3xl font-bold flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-primary" />
                  {registeredEvents.filter(e => e.status !== 'past').length}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Clubs</CardTitle>
              <CardDescription>Clubs you're a member of</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
              ) : (
                <div className="text-3xl font-bold flex items-center">
                  <Users className="mr-2 h-6 w-6 text-primary" />
                  {joinedClubs.length}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Past Events</CardTitle>
              <CardDescription>Events you've attended</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
              ) : (
                <div className="text-3xl font-bold flex items-center">
                  <Clock className="mr-2 h-6 w-6 text-primary" />
                  {registeredEvents.filter(e => e.status === 'past').length}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Clubs</CardTitle>
              <CardDescription>Clubs you can join</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-3/4" />
              ) : (
                <div className="text-3xl font-bold flex items-center">
                  <Info className="mr-2 h-6 w-6 text-primary" />
                  {clubs.filter(club => !joinedClubIds.includes(club.id)).length}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AvailableClubs 
            clubs={clubs}
            joinedClubIds={joinedClubIds}
            isLoading={isLoading}
            onJoinClub={handleJoinClub}
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

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="container">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
