
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubValidation = () => {
  const { toast } = useToast();

  const validateClubData = (clubFormData: ClubFormData): boolean => {
    // Check for required fields
    if (!clubFormData.name.trim()) {
      toast({
        title: 'Missing Name',
        description: 'Please provide a name for the club.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.description.trim()) {
      toast({
        title: 'Missing Description',
        description: 'Please provide a description for the club.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.category.trim()) {
      toast({
        title: 'Missing Category',
        description: 'Please select a category for the club.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.university.trim()) {
      toast({
        title: 'Missing University',
        description: 'Please select a university for the club.',
        variant: 'destructive',
      });
      return false;
    }

    // Additional validations can be added here

    return true;
  };

  return { validateClubData };
};
