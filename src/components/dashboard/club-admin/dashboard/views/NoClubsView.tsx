
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface NoClubsViewProps {
  onCreateClubClick: () => void;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const NoClubsView: React.FC<NoClubsViewProps> = ({
  onCreateClubClick,
  isLoading,
  error,
  onRefresh
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>No Clubs Found</CardTitle>
        <CardDescription>
          You don't have any clubs yet. Create your first club to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Spinner size={36} />
            <p className="text-muted-foreground">Loading your clubs...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={onRefresh} className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center space-y-2">
              <PlusCircle className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Create Your First Club</h3>
              <p className="text-muted-foreground max-w-md">
                Start by creating a club. This will allow you to create events, manage members, and more.
              </p>
            </div>
            <Button onClick={onCreateClubClick} className="mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Club
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NoClubsView;
