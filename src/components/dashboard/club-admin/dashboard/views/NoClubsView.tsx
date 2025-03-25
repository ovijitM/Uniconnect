
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from '@/hooks/club-admin/types';
import CreateClubDialog from '@/components/dashboard/CreateClubDialog';

interface NoClubsViewProps {
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
  handleClubFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
}

const NoClubsView: React.FC<NoClubsViewProps> = ({
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub,
  handleClubFileUpload
}) => {
  const { user } = useAuth();
  const { userUniversity, userUniversityId, fetchUserProfile, isLoadingProfile, profileFetched } = useStudentProfile(user?.id);
  const { toast } = useToast();
  const [hasRetried, setHasRetried] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  // Add retry logic for fetching the profile if needed
  useEffect(() => {
    if (profileFetched && !userUniversity && !hasRetried && user?.id) {
      const retryTimer = setTimeout(() => {
        console.log("Retrying profile fetch from NoClubsView...");
        fetchUserProfile();
        setHasRetried(true);
      }, 1500);
      
      return () => clearTimeout(retryTimer);
    }
  }, [profileFetched, userUniversity, fetchUserProfile, hasRetried, user?.id]);

  const handleCreateClubClick = () => {
    if (!userUniversity || !userUniversityId) {
      toast({
        title: "University Required",
        description: "You need to have a university associated with your profile to create a club. Please update your profile first.",
        variant: "warning",
      });
      return;
    }
    setIsClubDialogOpen(true);
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="text-center space-y-6 p-10 border rounded-lg bg-background shadow-sm">
        <h1 className="text-3xl font-bold">Welcome to Club Admin Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You don't have any clubs yet. Create your first club to start organizing events,
          managing members, and building your campus community.
        </p>
        
        {isLoadingProfile ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading your university information...</p>
          </div>
        ) : userUniversity ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              You'll be creating a club for <span className="font-medium">{userUniversity}</span>
            </p>
            <Button onClick={handleCreateClubClick} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Your First Club
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-amber-600 text-sm">
              You need to have a university in your profile to create a club.
            </p>
            <Button onClick={() => window.location.href = '/profile'} variant="outline">
              Update Profile
            </Button>
          </div>
        )}
      </div>

      {/* Club creation dialog */}
      <CreateClubDialog
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
