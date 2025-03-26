
import { useClubFormState } from './useClubFormState';
import { useClubValidation } from './useClubValidation';
import { useClubCreation } from './useClubCreation';
import { useToast } from '@/hooks/use-toast';

export const useClubForm = (userId: string | undefined, onSuccess: () => void) => {
  const {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    setIsSubmitting,
    handleClubInputChange,
    handleClubFileUpload,
    isLoadingProfile,
    profileError,
    retryProfileFetch
  } = useClubFormState();

  const { toast } = useToast();
  const { validateClubData } = useClubValidation();
  const { createClub } = useClubCreation();

  const handleCreateClub = async () => {
    try {
      if (isSubmitting) {
        console.log("Already submitting, blocking duplicate submission");
        return;
      }
      
      console.log("Starting club creation process...");
      setIsSubmitting(true);

      // Log form data for debugging
      console.log('Club form data before validation:', clubFormData);
      
      // Check if university is provided
      if (!clubFormData.university) {
        console.error("Missing university in form data");
        toast({
          title: "Missing University",
          description: "You must have a university affiliation to create a club. Please update your profile.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Validate the form data
      const validationResult = validateClubData(clubFormData);
      if (!validationResult.isValid) {
        console.error("Validation failed:", validationResult.errorMessage);
        toast({
          title: "Validation Error",
          description: validationResult.errorMessage || "Please check the form for errors.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check if logo is uploaded
      if (!clubFormData.logoUrl) {
        console.error("Missing logo in form data");
        toast({
          title: "Missing Logo",
          description: "Please upload a logo for your club.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Creating club with data:', clubFormData);
      console.log('User ID for club creation:', userId);
      
      const success = await createClub(clubFormData, userId);
      console.log("Club creation result:", success);
      
      if (success) {
        toast({
          title: "Club Created Successfully",
          description: "Your club has been created and is now pending approval.",
        });
        
        // Reset form with all required fields
        setClubFormData({
          name: '',
          description: '',
          category: '',
          university: clubFormData.university, // Keep the university 
          universityId: clubFormData.universityId, // Keep the university ID
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
        setIsClubDialogOpen(false);
        
        // Refresh data
        onSuccess();
      } else {
        console.error("Club creation failed without throwing an error");
        toast({
          title: "Error Creating Club",
          description: "Failed to create the club. Please check your form data and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleCreateClub:', error);
      toast({
        title: "Error Creating Club",
        description: "An error occurred while creating your club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClubClick = () => {
    if (!clubFormData.university) {
      if (profileError) {
        toast({
          title: "Profile Error",
          description: "Unable to load your university information. Please try again or update your profile.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "University Required",
        description: "You need to have a university associated with your profile to create a club. Please update your profile first.",
        variant: "warning",
      });
      return;
    }
    setIsClubDialogOpen(true);
  };

  const handleRetryProfileFetch = () => {
    if (retryProfileFetch) {
      retryProfileFetch();
      toast({
        title: "Retrying",
        description: "Attempting to reload your profile data...",
      });
    }
  };

  return {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    handleClubInputChange,
    handleCreateClub,
    handleClubFileUpload,
    isLoadingProfile,
    profileError,
    handleRetryProfileFetch,
    handleCreateClubClick
  };
};
