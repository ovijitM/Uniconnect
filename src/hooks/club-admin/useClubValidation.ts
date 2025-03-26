
import { ClubFormData } from './types';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const useClubValidation = () => {
  const validateClubData = (data: ClubFormData): ValidationResult => {
    // Check required fields
    if (!data.name || data.name.trim() === '') {
      return { isValid: false, errorMessage: "Club name is required" };
    }
    
    if (!data.description || data.description.trim() === '') {
      return { isValid: false, errorMessage: "Club description is required" };
    }
    
    if (!data.category || data.category.trim() === '') {
      return { isValid: false, errorMessage: "Club category is required" };
    }
    
    if (!data.university || data.university.trim() === '') {
      return { isValid: false, errorMessage: "University is required" };
    }
    
    // Validate length constraints
    if (data.name.length > 100) {
      return { isValid: false, errorMessage: "Club name must be less than 100 characters" };
    }
    
    if (data.description.length > 2000) {
      return { isValid: false, errorMessage: "Description must be less than 2000 characters" };
    }
    
    // All validations passed
    return { isValid: true };
  };

  return { validateClubData };
};
