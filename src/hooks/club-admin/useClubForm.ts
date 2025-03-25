
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
    handleClubFileUpload
  } = useClubFormState();

  const { toast } = useToast();
  const { validateClubData } = useClubValidation();
  const { createClub } = useClubCreation(userId, onSuccess);

  const handleCreateClub = async () => {
    try {
      if (isSubmitting) return; // Prevent multiple submissions
      setIsSubmitting(true);

      console.log('Validating club data:', clubFormData);
      
      const isValid = await validateClubData(clubFormData);
      if (!isValid) {
        console.log('Validation failed');
        setIsSubmitting(false);
        return;
      }

      // Check if logo is uploaded
      if (!clubFormData.logoUrl) {
        toast({
          title: "Missing Logo",
          description: "Please upload a logo for your club.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Creating club with data:', clubFormData);
      
      // Pass all required parameters to createClub
      await createClub(clubFormData, setClubFormData, setIsClubDialogOpen);
      
      // Success is handled inside createClub function
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error in handleCreateClub:', error);
      toast({
        title: "Error Creating Club",
        description: "An error occurred while creating your club. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
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
    handleClubFileUpload
  };
};
