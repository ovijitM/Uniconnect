
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersTable from '@/components/admin/UsersTable';
import ClubsTable from '@/components/admin/ClubsTable';
import OverviewTab from '@/components/admin/OverviewTab';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  users: any[];
  clubs: any[];
  isLoading: boolean;
  recentActivity: any[];
  systemAlerts: any[];
  onReviewItem: (id: string, type: 'club' | 'event') => void;
  onViewClub: (clubId: string) => void;
  onClubStatusChange?: () => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  setActiveTab,
  users,
  clubs,
  isLoading,
  recentActivity,
  systemAlerts,
  onReviewItem,
  onViewClub,
  onClubStatusChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="clubs">Clubs</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab 
          isLoading={isLoading}
          recentActivity={recentActivity}
          systemAlerts={systemAlerts}
          onReviewItem={onReviewItem}
        />
      </TabsContent>

      <TabsContent value="users">
        <UsersTable 
          users={users}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="clubs">
        <ClubsTable 
          clubs={clubs}
          isLoading={isLoading}
          onViewClub={onViewClub}
          onClubStatusChange={onClubStatusChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
