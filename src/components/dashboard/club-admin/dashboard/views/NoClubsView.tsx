
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClubFormData } from '@/hooks/club-admin/types';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ClubDialogWrapper from '@/components/dashboard/club-dialog/ClubDialogWrapper';

interface NoClubsViewProps {
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
  handleClubFileUpload?: (url: string, fileName: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const NoClubsView: React.FC<NoClubsViewProps> = ({
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub,
  handleClubFileUpload,
  isLoading = false,
  error = null,
  onRefresh
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Club Admin</CardTitle>
          <CardDescription>You don't have any clubs yet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <p className="text-center text-muted-foreground">
            Get started by creating your first club or refreshing if you've already created one.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
            <Button 
              onClick={() => setIsClubDialogOpen(true)} 
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Club
            </Button>
            
            {onRefresh && (
              <Button 
                variant="outline" 
                onClick={onRefresh}
                className="w-full sm:w-auto mt-2 sm:mt-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <ClubDialogWrapper
        isOpen={isClubDialogOpen}
        onOpenChange={setIsClubDialogOpen}
        formData={clubFormData}
        onInputChange={handleClubInputChange}
        onSubmit={handleCreateClub}
        onFileUpload={handleClubFileUpload}
        buttonText="Create Club"
      />
    </div>
  );
};

export default NoClubsView;
