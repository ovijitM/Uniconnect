
import { ClubFormData } from './types';
import { validateRequiredFields } from './utils/dataTransformUtils';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const useClubValidation = () => {
  const validateClubData = (formData: ClubFormData): ValidationResult => {
    console.log("Validating club data:", formData);
    
    try {
      // Required fields for basic info
      const requiredFields = [
        'name',
        'description',
        'category',
        'tagline',
        'university'
      ];
      
      // Check required fields
      if (!validateRequiredFields(formData, requiredFields)) {
        console.error("Missing required basic fields");
        return {
          isValid: false,
          errorMessage: "Please fill in all required fields in the Basic Info tab."
        };
      }
      
      // Check logo is present
      if (!formData.logoUrl) {
        console.error("Missing logo URL");
        return {
          isValid: false,
          errorMessage: "Please upload a logo for your club in the Basic Info tab."
        };
      }

      // Log the validated data for debugging
      console.log("Validation passed, club data is valid:", {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tagline: formData.tagline,
        university: formData.university,
        universityId: formData.universityId,
        logoUrl: formData.logoUrl?.substring(0, 30) + '...',
        socialMedia: {
          website: formData.website,
          facebookLink: formData.facebookLink,
          instagramLink: formData.instagramLink,
          twitterLink: formData.twitterLink,
          discordLink: formData.discordLink,
        },
        details: {
          establishedYear: formData.establishedYear,
          affiliation: formData.affiliation,
          whyJoin: formData.whyJoin,
          regularEvents: formData.regularEvents,
          signatureEvents: formData.signatureEvents,
          communityEngagement: formData.communityEngagement,
          whoCanJoin: formData.whoCanJoin,
          membershipFee: formData.membershipFee,
          howToJoin: formData.howToJoin,
          presidentName: formData.presidentName,
          presidentContact: formData.presidentContact,
          executiveMembers: formData.executiveMembers,
          advisors: formData.advisors,
          phoneNumber: formData.phoneNumber,
        },
        documents: {
          documentUrl: formData.documentUrl,
          documentName: formData.documentName,
        }
      });

      // All validations passed
      return { isValid: true };
    } catch (error) {
      console.error("Error during club validation:", error);
      return { 
        isValid: false, 
        errorMessage: "An unexpected error occurred during validation. Please try again."
      };
    }
  };

  return { validateClubData };
};
