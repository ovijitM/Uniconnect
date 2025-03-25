
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubValidation = () => {
  const { toast } = useToast();

  const validateClubData = async (clubFormData: ClubFormData): Promise<boolean> => {
    // Basic information validation
    const basicFields = [
      { field: 'name', label: 'Club Name' },
      { field: 'description', label: 'Description' },
      { field: 'category', label: 'Category' },
      { field: 'tagline', label: 'Tagline' },
      { field: 'establishedYear', label: 'Established Year' },
    ];
    
    for (const { field, label } of basicFields) {
      if (!clubFormData[field as keyof ClubFormData]?.toString().trim()) {
        toast({
          title: `Missing ${label}`,
          description: `Please provide a ${label.toLowerCase()} for your club.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    // Profile information validation
    if (!clubFormData.logoUrl?.trim()) {
      toast({
        title: `Missing Logo`,
        description: `Please upload a logo for your club.`,
        variant: 'destructive',
      });
      return false;
    }

    // Membership information validation
    if (!clubFormData.whyJoin?.trim()) {
      toast({
        title: 'Missing "Why Join" Information',
        description: 'Please complete the "Why Join" section.',
        variant: 'destructive',
      });
      return false;
    }

    // Contact information validation
    const contactFields = [
      { field: 'presidentName', label: 'President Name' },
      { field: 'presidentContact', label: 'President Contact' },
      { field: 'phoneNumber', label: 'Phone Number' },
    ];
    
    for (const { field, label } of contactFields) {
      if (!clubFormData[field as keyof ClubFormData]?.toString().trim()) {
        toast({
          title: `Missing ${label}`,
          description: `Please provide ${label.toLowerCase()} information.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  return { validateClubData };
};
