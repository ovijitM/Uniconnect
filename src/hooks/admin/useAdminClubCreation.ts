
import { useState } from 'react';
import { ClubFormData } from '@/hooks/club-admin/types';
import { useClubCreation } from '@/hooks/club-admin/useClubCreation';
import { useClubValidation } from '@/hooks/club-admin/useClubValidation';
import { useToast } from '@/hooks/use-toast';

export const useAdminClubCreation = (userId: string | undefined, onSuccess: () => void) => {
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: '',
    university: '',
    universityId: '',
    tagline: '',
    establishedYear: '',
    affiliation: '',
    whyJoin: '',
    regularEvents: '',
    signatureEvents: '',
    communityEngagement: '',
    whoCanJoin: '',
    membershipFee: 'Free',
    howToJoin: '',
    presidentName: '',
    presidentContact: '',
    executiveMembers: '',
    advisors: '',
    phoneNumber: '',
    website: '',
    facebookLink: '',
    instagramLink: '',
    twitterLink: '',
    discordLink: '',
    logoUrl: '',
    documentUrl: '',
    documentName: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { validateClubData } = useClubValidation();
  const { createClub } = useClubCreation();

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (url: string, fileName: string, type: 'logo' | 'document' = 'document') => {
    if (type === 'logo') {
      setClubFormData(prev => ({ ...prev, logoUrl: url }));
    } else {
      setClubFormData(prev => ({ 
        ...prev, 
        documentUrl: url,
        documentName: fileName
      }));
    }
  };

  const handleCreateClub = async () => {
    try {
      if (isSubmitting) {
        return;
      }
      
      setIsSubmitting(true);
      
      // Validate the form data
      const validationResult = validateClubData(clubFormData);
      if (!validationResult.isValid) {
        toast({
          title: "Validation Error",
          description: validationResult.errorMessage || "Please check the form for errors.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create the club
      const success = await createClub(clubFormData, userId);
      
      if (success) {
        toast({
          title: "Club Created Successfully",
          description: "The club has been created successfully.",
        });
        
        // Reset form
        setClubFormData({
          name: '',
          description: '',
          category: '',
          university: '',
          universityId: '',
          tagline: '',
          establishedYear: '',
          affiliation: '',
          whyJoin: '',
          regularEvents: '',
          signatureEvents: '',
          communityEngagement: '',
          whoCanJoin: '',
          membershipFee: 'Free',
          howToJoin: '',
          presidentName: '',
          presidentContact: '',
          executiveMembers: '',
          advisors: '',
          phoneNumber: '',
          website: '',
          facebookLink: '',
          instagramLink: '',
          twitterLink: '',
          discordLink: '',
          logoUrl: '',
          documentUrl: '',
          documentName: ''
        });
        
        // Call success callback
        onSuccess();
      } else {
        toast({
          title: "Error Creating Club",
          description: "Failed to create the club. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleCreateClub:', error);
      toast({
        title: "Error Creating Club",
        description: "An error occurred while creating the club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clubFormData,
    setClubFormData,
    isSubmitting,
    handleClubInputChange,
    handleCreateClub,
    handleFileUpload
  };
};
