
import { useClubFormState } from './useClubFormState';
import { useClubValidation } from './useClubValidation';
import { useClubCreation } from './useClubCreation';
import { ClubFormData } from './types';

export const useClubForm = (userId: string | undefined, onSuccess: () => void) => {
  const {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    setIsSubmitting,
    handleClubInputChange
  } = useClubFormState();

  const { validateClubData } = useClubValidation();
  const { createClub } = useClubCreation();

  const handleCreateClub = async () => {
    try {
      if (isSubmitting) return; // Prevent multiple submissions
      setIsSubmitting(true);

      const isValid = await validateClubData(clubFormData);
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      console.log('Creating club with data:', clubFormData);
      
      const success = await createClub(clubFormData, userId);
      if (success) {
        // Reset form and close dialog
        setClubFormData({
          name: '',
          description: '',
          category: '',
          // Reset new fields
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
          discordLink: ''
        });
        setIsClubDialogOpen(false);
        
        // Refresh data
        onSuccess();
      }
    } catch (error) {
      console.error('Error in handleCreateClub:', error);
    } finally {
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
    handleCreateClub
  };
};
