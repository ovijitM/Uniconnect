
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import ClubDialogWrapper from './club-dialog/ClubDialogWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from '@/hooks/club-admin/types';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CreateClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  buttonText?: string;
  trigger?: React.ReactNode;
  isLoadingProfile?: boolean;
  profileError?: string | null;
}

const CreateClubDialog: React.FC<CreateClubDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  onFileUpload,
  buttonText = "Create New Club",
  trigger,
  isLoadingProfile,
  profileError
}) => {
  const { user } = useAuth();
  const { 
    userUniversity, 
    userUniversityId, 
    fetchUserProfile
  } = useStudentProfile(user?.id);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  useEffect(() => {
    // Update form data with university information when available
    if (userUniversity && userUniversityId) {
      console.log("Setting university in form:", userUniversity, userUniversityId);
      
      // Create fake events to update form data
      const universityEvent = {
        target: { name: 'university', value: userUniversity }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onInputChange(universityEvent);
      
      const universityIdEvent = {
        target: { name: 'universityId', value: userUniversityId }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onInputChange(universityIdEvent);
    }
  }, [userUniversity, userUniversityId, onInputChange]);

  const handleOpenChange = (open: boolean) => {
    if (open && !userUniversity) {
      // Only show this warning if we're not still loading and there was no error
      if (!isLoadingProfile && !profileError) {
        toast({
          title: "Missing University Affiliation",
          description: "You need to have a university in your profile to create a club. Please update your profile first.",
          variant: "warning",
        });
        return;
      } else if (profileError) {
        toast({
          title: "Profile Error",
          description: "There was an error loading your profile. Please try again or update your profile.",
          variant: "destructive",
        });
      }
    }
    
    onOpenChange(open);
  };

  const handleRetryProfile = () => {
    if (user?.id) {
      toast({
        title: "Retrying",
        description: "Attempting to reload your profile data...",
      });
      fetchUserProfile();
    }
  };

  // Show fallback UI if there's an error loading profile
  if (profileError && isOpen) {
    return (
      <div className="p-6 flex flex-col items-center justify-center space-y-4 bg-background border rounded-lg shadow-md">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error Loading Profile</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{profileError}</p>
            <p>Your university information is required to create a club.</p>
            <Button 
              onClick={handleRetryProfile} 
              variant="outline" 
              size="sm" 
              className="w-fit mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Loading Profile
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const defaultTrigger = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );

  return (
    <ErrorBoundary>
      <ClubDialogWrapper
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        formData={formData}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        onFileUpload={onFileUpload}
        buttonText="Create Club"
        trigger={trigger || defaultTrigger}
      />
    </ErrorBoundary>
  );
};

export default CreateClubDialog;
