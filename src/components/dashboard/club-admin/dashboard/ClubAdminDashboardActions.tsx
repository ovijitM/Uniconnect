
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useClubAdminRoutes } from './useClubAdminRoutes';

interface ClubAdminDashboardActionsProps {
  profileError: string | undefined;
  isLoadingProfile: boolean;
  handleRetryProfileFetch: () => void;
  handleCreateClubClick: () => void;
  setIsEventDialogOpen: (open: boolean) => void;
}

const ClubAdminDashboardActions: React.FC<ClubAdminDashboardActionsProps> = ({
  profileError,
  isLoadingProfile,
  handleRetryProfileFetch,
  handleCreateClubClick,
  setIsEventDialogOpen
}) => {
  const { currentView } = useClubAdminRoutes();

  // Render quick action buttons based on current view
  const renderQuickActions = () => {
    switch (currentView) {
      case 'events':
        return (
          <Button 
            onClick={() => setIsEventDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Event
          </Button>
        );
      case 'clubs':
        return (
          <Button 
            onClick={handleCreateClubClick}
            className="flex items-center gap-2"
            disabled={isLoadingProfile}
          >
            <PlusCircle className="h-4 w-4" />
            Create Club
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Profile error alert */}
      {profileError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Profile Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{profileError}</p>
            <p>This may prevent you from creating clubs or accessing certain features.</p>
            <Button 
              onClick={handleRetryProfileFetch} 
              variant="outline" 
              size="sm" 
              className="w-fit mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Loading Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Quick action buttons */}
      <div className="flex justify-end mb-4">
        {renderQuickActions()}
      </div>
    </>
  );
};

export default ClubAdminDashboardActions;
