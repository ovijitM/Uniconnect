
import React from 'react';
import RecentActivityPanel from '@/components/admin/RecentActivityPanel';
import SystemAlertsPanel from '@/components/admin/SystemAlertsPanel';

interface OverviewTabProps {
  isLoading: boolean;
  recentActivity: any[];
  systemAlerts: any[];
  onReviewItem: (id: string, type: 'club' | 'event') => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  isLoading,
  recentActivity,
  systemAlerts,
  onReviewItem
}) => {
  return (
    <div className="space-y-4">
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
