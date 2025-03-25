
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubValidation = () => {
  const { toast } = useToast();

  const validateClubData = async (clubFormData: ClubFormData): Promise<boolean> => {
    // Check for required basic information
    if (!clubFormData.name.trim()) {
      toast({
        title: 'Missing Club Name',
        description: 'Please provide a name for your club.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.description.trim()) {
      toast({
        title: 'Missing Description',
        description: 'Please provide a description for your club.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.category.trim()) {
      toast({
        title: 'Missing Category',
        description: 'Please select a category for your club.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.university) {
      toast({
        title: 'Missing University',
        description: 'Please select a university for your club.',
        variant: 'destructive',
      });
      return false;
    }

    // Check for required profile information
    if (!clubFormData.tagline?.trim()) {
      toast({
        title: 'Missing Tagline',
        description: 'Please provide a tagline for your club.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.establishedYear?.trim()) {
      toast({
        title: 'Missing Established Year',
        description: 'Please provide the year your club was established.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.logoUrl?.trim()) {
      toast({
        title: 'Missing Logo',
        description: 'Please upload a logo for your club.',
        variant: 'destructive',
      });
      return false;
    }

    // Check for required membership information
    if (!clubFormData.whyJoin?.trim()) {
      toast({
        title: 'Missing "Why Join" Information',
        description: 'Please complete the "Why Join" section.',
        variant: 'destructive',
      });
      return false;
    }

    // Check for required contact information
    if (!clubFormData.presidentName?.trim()) {
      toast({
        title: 'Missing President Name',
        description: 'Please provide the club president\'s name.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubFormData.presidentContact?.trim()) {
      toast({
        title: 'Missing President Contact',
        description: 'Please provide contact information for the club president.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return { validateClubData };
};
