
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubDialogValidation = () => {
  const { toast } = useToast();

  const validateBasicInfo = (formData: ClubFormData): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Required Field Missing",
        description: "Club name is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Required Field Missing",
        description: "Club description is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category.trim()) {
      toast({
        title: "Required Field Missing",
        description: "Club category is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.university) {
      toast({
        title: "Required Field Missing",
        description: "You must have a university affiliation to create a club.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateDetails = (formData: ClubFormData): boolean => {
    // Optional validation for the details tab
    // You can add validation for specific fields if needed
    return true;
  };

  const validateSocialMedia = (formData: ClubFormData): boolean => {
    // Optional validation for social media links
    // You can add validation for URL formats if needed
    return true;
  };

  const validateDocuments = (formData: ClubFormData): boolean => {
    if (!formData.logoUrl) {
      toast({
        title: "Required Field Missing",
        description: "Please upload a club logo.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  return {
    validateBasicInfo,
    validateDetails,
    validateSocialMedia,
    validateDocuments
  };
};
