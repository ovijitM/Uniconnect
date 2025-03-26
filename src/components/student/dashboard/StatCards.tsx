
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardsProps {
  registeredEvents: any[];
  joinedClubs: any[];
  clubs: any[];
  joinedClubIds: string[];
  isLoading: boolean;
}

export const StatCards: React.FC<StatCardsProps> = ({
  registeredEvents,
  joinedClubs,
  clubs,
  joinedClubIds,
  isLoading
}) => {
  return (
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
  );
};
