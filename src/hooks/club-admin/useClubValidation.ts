
import { ClubFormData } from './types';
import { useToast } from '@/hooks/use-toast';

export const useClubValidation = () => {
  const { toast } = useToast();

  const validateClubData = (data: ClubFormData): { isValid: boolean; errorMessage?: string } => {
    // Basic required fields
    if (!data.name || data.name.trim() === '') {
      return { isValid: false, errorMessage: 'Club name is required' };
    }

    if (!data.description || data.description.trim() === '') {
      return { isValid: false, errorMessage: 'Club description is required' };
    }

    if (!data.category || data.category.trim() === '') {
      return { isValid: false, errorMessage: 'Club category is required' };
    }

    // Check if university is provided
    if (!data.university || data.university.trim() === '') {
      return { isValid: false, errorMessage: 'University is required' };
    }

    // Check for logo
    if (!data.logoUrl) {
      return { isValid: false, errorMessage: 'Club logo is required' };
    }

    // All validations passed
    return { isValid: true };
  };

  return {
    validateClubData
  };
};
