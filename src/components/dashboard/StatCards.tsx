
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, LineChart } from 'lucide-react';

interface StatCardsProps {
  activeEventCount: number;
  totalMembersCount: number;
  pastEventCount: number;
  averageAttendance: number;
  isLoading: boolean;
}

const StatCards: React.FC<StatCardsProps> = ({
  activeEventCount,
  totalMembersCount,
  pastEventCount,
  averageAttendance,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Events</CardTitle>
          <CardDescription>Currently running events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-primary" />
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              activeEventCount
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Club Members</CardTitle>
          <CardDescription>Total registered members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              totalMembersCount
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Past Events</CardTitle>
          <CardDescription>Total completed events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <Clock className="mr-2 h-6 w-6 text-primary" />
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              pastEventCount
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Event Attendance</CardTitle>
          <CardDescription>Average attendees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <LineChart className="mr-2 h-6 w-6 text-primary" />
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              averageAttendance
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
