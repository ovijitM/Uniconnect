
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  id: string;
  type: 'club' | 'event';
  name: string;
  description: string;
}

interface RecentActivityPanelProps {
  isLoading: boolean;
  recentActivity: ActivityItem[];
  onReviewItem: (id: string, type: 'club' | 'event') => void;
}

const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  isLoading,
  recentActivity,
  onReviewItem
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Recently created clubs and events</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map(item => (
              <div key={`${item.type}-${item.id}`} className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  {item.type === 'club' ? (
                    <Building className="h-6 w-6 text-primary" />
                  ) : (
                    <Calendar className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onReviewItem(item.id, item.type)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityPanel;
