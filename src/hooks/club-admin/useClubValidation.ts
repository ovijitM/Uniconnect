import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubValidation = () => {
  const { toast } = useToast();

  const validateClubData = async (clubFormData: ClubFormData): Promise<boolean> => {
    // Check for required basic information
    if (!clubFormData.name.trim() || !clubFormData.description.trim() || !clubFormData.category.trim()) {
      toast({
        title: 'Missing Basic Information',
        description: 'Please fill in all required basic fields (name, description, category).',
        variant: 'destructive',
      });
      return false;
    }

    // Check for required profile information
    if (!clubFormData.tagline.trim() || 
        !clubFormData.establishedYear.trim() || 
        !clubFormData.affiliation.trim() || 
        !clubFormData.logoUrl.trim()) {
      toast({
        title: 'Missing Profile Information',
        description: 'Please provide tagline, established year, affiliation, and logo URL.',
        variant: 'destructive',
      });
      return false;
    }

    // Check for required membership information
    if (!clubFormData.whyJoin.trim() || 
        !clubFormData.whoCanJoin.trim() || 
        !clubFormData.howToJoin.trim()) {
      toast({
        title: 'Missing Membership Information',
        description: 'Please complete why join, who can join, and how to join sections.',
        variant: 'destructive',
      });
      return false;
    }

    // Check for required contact information
    if (!clubFormData.presidentName.trim() || 
        !clubFormData.presidentContact.trim() || 
        !clubFormData.phoneNumber.trim()) {
      toast({
        title: 'Missing Contact Information',
        description: 'Please provide president name, contact information, and phone number.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return { validateClubData };
};
