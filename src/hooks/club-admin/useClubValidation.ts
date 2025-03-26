
import { ClubFormData } from './types';

export const useClubValidation = () => {
  const validateClubForm = (formData: ClubFormData): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name) {
      errors.name = 'Club name is required';
    }
    
    if (!formData.description) {
      errors.description = 'Description is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.university) {
      errors.university = 'University is required';
    }
    
    // Validate established year if provided
    if (formData.establishedYear) {
      const year = parseInt(formData.establishedYear);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year)) {
        errors.establishedYear = 'Year must be a number';
      } else if (year < 1800 || year > currentYear) {
        errors.establishedYear = `Year must be between 1800 and ${currentYear}`;
      }
    }
    
    // Validate URLs if provided
    const urlFields = ['website', 'facebookLink', 'instagramLink', 'twitterLink', 'discordLink'];
    
    urlFields.forEach(field => {
      const value = formData[field as keyof ClubFormData] as string;
      
      if (value && !isValidUrl(value)) {
        errors[field] = 'Please enter a valid URL';
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      // If the URL doesn't have a protocol, add https://
      const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
      new URL(urlWithProtocol);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  return {
    validateClubForm
  };
};
