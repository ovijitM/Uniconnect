
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RecentActivityPanel from '@/components/admin/RecentActivityPanel';
import SystemAlertsPanel from '@/components/admin/SystemAlertsPanel';
import StatCards from '@/components/dashboard/StatCards';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <StatCards 
        activeEventCount={clubsCount} // Using clubs count as "active" metric
        totalMembersCount={usersCount}
        pastEventCount={systemAlerts.length}
        averageAttendance={adminCount}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin-dashboard/activity')}
              >
                View All
              </Button>
            </div>
            <div className="h-[300px] overflow-auto">
              <RecentActivityPanel 
                isLoading={isLoading}
                recentActivity={recentActivity.slice(0, 3)}
                onReviewItem={onReviewItem}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">System Alerts</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin-dashboard/alerts')}
              >
                View All
              </Button>
            </div>
            <div className="h-[300px] overflow-auto">
              <SystemAlertsPanel 
                isLoading={isLoading}
                systemAlerts={systemAlerts.slice(0, 3)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Quick Access</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => navigate('/admin-dashboard/users')}
              >
                Users Management
              </Button>
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => navigate('/admin-dashboard/clubs')}
              >
                Clubs Management
              </Button>
              <Button 
                variant="outline" 
                className="h-20"
                onClick={() => navigate('/admin-dashboard/universities')}
              >
                Universities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
