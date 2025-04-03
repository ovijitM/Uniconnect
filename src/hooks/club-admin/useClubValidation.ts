
import { ClubFormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';

export const useClubValidation = () => {
  const { toast } = useToast();
  
  const validateClubForm = (formData: ClubFormData): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Required fields - basic info tab
    if (!formData.name?.trim()) {
      errors.name = 'Club name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Club name must be less than 100 characters';
    }
    
    if (!formData.description?.trim()) {
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
    
    // Validate contact information
    if (formData.presidentChairContact && !isValidEmail(formData.presidentChairContact)) {
      if (!isValidPhoneNumber(formData.presidentChairContact)) {
        errors.presidentChairContact = 'Please enter a valid email or phone number';
      }
    }
    
    // Validate URLs if provided
    const urlFields = [
      'website', 
      'facebookLink', 
      'instagramLink', 
      'twitterLink', 
      'discordLink'
    ];
    
    urlFields.forEach(field => {
      const value = formData[field as keyof ClubFormData] as string;
      
      if (value && !isValidUrl(value)) {
        errors[field] = 'Please enter a valid URL';
      }
    });
    
    // Also check social media links object if present
    if (formData.socialMediaLinks) {
      const socialFields = [
        'website', 
        'instagram', 
        'facebook', 
        'twitter', 
        'linkedin', 
        'discord'
      ];
      
      socialFields.forEach(field => {
        const value = formData.socialMediaLinks?.[field];
        if (value && !isValidUrl(value)) {
          errors[`socialMediaLinks.${field}`] = 'Please enter a valid URL';
        }
      });
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  const validateClubData = (formData: ClubFormData): boolean => {
    const { isValid, errors } = validateClubForm(formData);
    
    if (!isValid) {
      // Display the first error message
      const firstError = Object.values(errors)[0];
      toast({
        title: 'Validation Error',
        description: firstError,
        variant: 'destructive',
      });
    }
    
    return isValid;
  };
  
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isValidPhoneNumber = (phone: string): boolean => {
    // Simple regex for phone numbers - can be made more sophisticated based on requirements
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
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
    validateClubForm,
    validateClubData,
    isValidUrl,
    isValidEmail,
    isValidPhoneNumber
  };
};
