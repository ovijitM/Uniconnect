
import { ClubFormData } from './types';
import { validateRequiredFields } from './utils/dataTransformUtils';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const useClubValidation = () => {
  const validateClubData = (formData: ClubFormData): ValidationResult => {
    console.log("Validating club data:", formData);
    
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
      return {
        isValid: false,
        errorMessage: "Please fill in all required fields in the Basic Info tab."
      };
    }
    
    // Check logo is present
    if (!formData.logoUrl) {
      return {
        isValid: false,
        errorMessage: "Please upload a logo for your club in the Basic Info tab."
      };
    }

    // All validations passed
    return { isValid: true };
  };

  return { validateClubData };
};
