
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import ClubDialogWrapper from './club-dialog/ClubDialogWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { useToast } from '@/hooks/use-toast';

interface CreateClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    logoUrl?: string;
    establishedYear?: string;
    affiliation?: string;
    whyJoin?: string;
    regularEvents?: string;
    signatureEvents?: string;
    communityEngagement?: string;
    whoCanJoin?: string;
    membershipFee?: string;
    howToJoin?: string;
    presidentName?: string;
    presidentContact?: string;
    executiveMembers?: string;
    advisors?: string;
    phoneNumber?: string;
    website?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    discordLink?: string;
    documentUrl?: string;
    documentName?: string;
    university?: string;
    universityId?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  buttonText?: string;
  trigger?: React.ReactNode;
}

const CreateClubDialog: React.FC<CreateClubDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  onFileUpload,
  buttonText = "Create New Club",
  trigger
}) => {
  const { user } = useAuth();
  const { userUniversity, userUniversityId, fetchUserProfile } = useStudentProfile(user?.id);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  useEffect(() => {
    // Update form data with university information when available
    if (userUniversity && userUniversityId) {
      // Only update if not already set or if changed
      if (formData.university !== userUniversity || formData.universityId !== userUniversityId) {
        // Create a fake event to use the existing onInputChange handler
        const universityEvent = {
          target: { name: 'university', value: userUniversity }
        } as React.ChangeEvent<HTMLInputElement>;
        
        onInputChange(universityEvent);
        
        // Also set universityId through a different method if needed
        // This depends on how your form state is managed
        // You might need to modify your form state handling to include universityId directly
      }
    }
  }, [userUniversity, userUniversityId, formData.university, formData.universityId]);

  const handleOpenChange = (open: boolean) => {
    if (open && !userUniversity) {
      toast({
        title: "Missing University Affiliation",
        description: "You need to have a university in your profile to create a club. Please update your profile first.",
        variant: "warning",
      });
      return;
    }
    
    onOpenChange(open);
  };

  const defaultTrigger = (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );

  return (
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
  );
};

export default CreateClubDialog;
