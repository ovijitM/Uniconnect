
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsersTable from './UsersTable';
import { ClubsTableContent } from './clubs-table';
import SystemAlertsPanel from './SystemAlertsPanel';
import RecentActivityPanel from './RecentActivityPanel';
import OverviewTab from './OverviewTab';
import UniversityManagement from './UniversityManagement';

interface AdminTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  users: any[];
  clubs: any[];
  isLoading: boolean;
  recentActivity: any[];
  systemAlerts: any[];
  adminCount: number;
  systemStatus: string;
  onReviewItem: (id: string, type: 'club' | 'event') => void;
  onViewClub: (clubId: string) => void;
  onClubStatusChange: () => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  setActiveTab,
  users,
  clubs,
  isLoading,
  recentActivity,
  systemAlerts,
  adminCount,
  systemStatus,
  onReviewItem,
  onViewClub,
  onClubStatusChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
      <TabsList className="grid w-full grid-cols-5 mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="clubs">Clubs</TabsTrigger>
        <TabsTrigger value="universities">Universities</TabsTrigger>
        <TabsTrigger value="activity">Activity & Alerts</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <OverviewTab 
          usersCount={users.length}
          clubsCount={clubs.length}
          adminCount={adminCount}
          systemStatus={systemStatus}
          recentActivity={recentActivity}
          systemAlerts={systemAlerts}
          isLoading={isLoading}
          onReviewItem={onReviewItem}
        />
      </TabsContent>
      
      <TabsContent value="users">
        <UsersTable users={users} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="clubs">
        <ClubsTableContent 
          clubs={clubs} 
          isLoading={isLoading}
          processingId={null}
          onApprove={(id) => onReviewItem(id, 'club')}
          onReject={(id) => onReviewItem(id, 'club')}
          onView={onViewClub}
        />
      </TabsContent>

      <TabsContent value="universities">
        <UniversityManagement />
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-6">
        <RecentActivityPanel 
          recentActivity={recentActivity}
          isLoading={isLoading}
          onReviewItem={onReviewItem}
        />
        <SystemAlertsPanel 
          systemAlerts={systemAlerts}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
