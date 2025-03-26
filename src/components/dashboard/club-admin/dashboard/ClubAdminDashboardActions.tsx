
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClubAdminDashboardActionsProps {
  profileError: string | null;
  isLoadingProfile: boolean;
  handleRetryProfileFetch: () => void;
  setIsEventDialogOpen: (open: boolean) => void;
}

const ClubAdminDashboardActions: React.FC<ClubAdminDashboardActionsProps> = ({
  profileError,
  isLoadingProfile,
  handleRetryProfileFetch,
  setIsEventDialogOpen
}) => {
  return (
    <div className="py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Club Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsEventDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>
      
      {profileError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription className="flex justify-between items-center">
            <span>Failed to load your profile data: {profileError}</span>
            <Button
              variant="outline" 
              size="sm"
              onClick={handleRetryProfileFetch}
              disabled={isLoadingProfile}
            >
              {isLoadingProfile ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Retry</span>
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ClubAdminDashboardActions;
