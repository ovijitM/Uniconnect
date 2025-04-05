
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSocialFeed } from '@/hooks/useSocialFeed';
import OverviewTabContent from './tabs/OverviewTabContent';
import ClubsTabContent from './tabs/ClubsTabContent';
import EventsTabContent from './tabs/EventsTabContent';
import SocialTabContent from './tabs/SocialTabContent';

interface DashboardTabsProps {
  user: any;
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

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  user,
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
  const { posts, isLoading: isLoadingPosts, refreshFeed } = useSocialFeed(user?.id);

  return (
    <Tabs defaultValue="overview" className="mt-8">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="clubs">Clubs</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="social">Social Feed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTabContent
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
      </TabsContent>
      
      <TabsContent value="clubs">
        <ClubsTabContent
          joinedClubs={joinedClubs}
          isLoading={isLoading}
          onLeaveClub={onLeaveClub}
        />
      </TabsContent>
      
      <TabsContent value="events">
        <EventsTabContent
          registeredEvents={registeredEvents}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="social">
        <SocialTabContent
          posts={posts}
          isLoading={isLoadingPosts}
          userId={user?.id}
          refreshFeed={refreshFeed}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
