
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ClubAdminHeaderTabs: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (currentPath.includes('/events')) return 'events';
    if (currentPath.includes('/members')) return 'members';
    if (currentPath.includes('/clubs')) return 'clubs';
    if (currentPath.includes('/profile')) return 'profile';
    return 'overview';
  };

  return (
    <Tabs value={getActiveTab()} className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="overview" asChild>
          <Link to="/club-admin-dashboard">Overview</Link>
        </TabsTrigger>
        <TabsTrigger value="events" asChild>
          <Link to="/club-admin-dashboard/events">Events</Link>
        </TabsTrigger>
        <TabsTrigger value="clubs" asChild>
          <Link to="/club-admin-dashboard/clubs">Clubs</Link>
        </TabsTrigger>
        <TabsTrigger value="members" asChild>
          <Link to="/club-admin-dashboard/members">Members</Link>
        </TabsTrigger>
        <TabsTrigger value="profile" asChild>
          <Link to="/club-admin-dashboard/profile">Profile</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ClubAdminHeaderTabs;
