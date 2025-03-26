
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Clock, Info } from 'lucide-react';

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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Upcoming Events"
        value={registeredEvents.filter(e => e.status !== 'past').length}
        icon={<Calendar className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
        color="bg-blue-50 dark:bg-blue-950"
        iconColor="bg-blue-100 dark:bg-blue-900"
      />
      
      <StatCard
        title="Your Clubs"
        value={joinedClubs.length}
        icon={<Users className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
        color="bg-purple-50 dark:bg-purple-950"
        iconColor="bg-purple-100 dark:bg-purple-900"
      />

      <StatCard
        title="Past Events"
        value={registeredEvents.filter(e => e.status === 'past').length}
        icon={<Clock className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
        color="bg-green-50 dark:bg-green-950"
        iconColor="bg-green-100 dark:bg-green-900"
      />

      <StatCard
        title="Available Clubs"
        value={clubs.filter(club => !joinedClubIds.includes(club.id)).length}
        icon={<Info className="h-6 w-6 text-primary" />}
        isLoading={isLoading}
        color="bg-amber-50 dark:bg-amber-950"
        iconColor="bg-amber-100 dark:bg-amber-900"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
  color: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isLoading, color, iconColor }) => {
  return (
    <Card className={`border-none shadow-sm ${color}`}>
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-3 ${iconColor}`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-7 w-12 bg-muted animate-pulse rounded" />
              ) : (
                value
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
