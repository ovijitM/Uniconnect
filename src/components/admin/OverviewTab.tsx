
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RecentActivityPanel from '@/components/admin/RecentActivityPanel';
import SystemAlertsPanel from '@/components/admin/SystemAlertsPanel';
import StatCards from '@/components/dashboard/StatCards';

interface OverviewTabProps {
  isLoading: boolean;
  recentActivity: any[];
  systemAlerts: any[];
  usersCount: number;
  clubsCount: number;
  adminCount: number;
  systemStatus: string;
  onReviewItem: (id: string, type: 'club' | 'event') => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  isLoading,
  recentActivity,
  systemAlerts,
  usersCount,
  clubsCount,
  adminCount,
  systemStatus,
  onReviewItem
}) => {
  return (
    <div className="space-y-6">
      <StatCards 
        activeEventCount={clubsCount} // Using clubs count as "active" metric
        totalMembersCount={usersCount}
        pastEventCount={systemAlerts.length}
        averageAttendance={adminCount}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivityPanel 
          isLoading={isLoading}
          recentActivity={recentActivity}
          onReviewItem={onReviewItem}
        />
        <SystemAlertsPanel 
          isLoading={isLoading}
          systemAlerts={systemAlerts}
        />
      </div>
    </div>
  );
};

export default OverviewTab;
