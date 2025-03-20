
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SystemAlert {
  type: 'success' | 'warning' | 'error';
  title: string;
  time: string;
}

interface SystemAlertsPanelProps {
  isLoading: boolean;
  systemAlerts: SystemAlert[];
}

const SystemAlertsPanel: React.FC<SystemAlertsPanelProps> = ({
  isLoading,
  systemAlerts
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
        <CardDescription>Recent notifications</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center p-3 ${
                alert.type === 'success' ? 'bg-green-100' : 
                alert.type === 'warning' ? 'bg-amber-100' : 'bg-red-100'
              } rounded-lg`}>
                {alert.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                )}
                <div>
                  <h4 className="font-semibold">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAlertsPanel;
