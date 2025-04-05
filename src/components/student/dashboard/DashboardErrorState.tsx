
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import DashboardGreeting from '@/components/dashboard/shared/DashboardGreeting';

interface DashboardErrorStateProps {
  error: string | null;
  userName: string;
  refreshData?: () => void;
}

const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({ 
  error, 
  userName, 
  refreshData 
}) => {
  return (
    <div className="space-y-6">
      <DashboardGreeting 
        userName={userName} 
        subtitle="Your student dashboard at a glance"
        hasError={true}
      />
      
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading data</AlertTitle>
        <AlertDescription>
          {error}
          {refreshData && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => refreshData()}
            >
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DashboardErrorState;
