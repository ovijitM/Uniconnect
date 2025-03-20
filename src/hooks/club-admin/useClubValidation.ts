
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from './types';

export const useClubValidation = () => {
  const { toast } = useToast();

  const validateClubData = async (clubFormData: ClubFormData): Promise<boolean> => {
    if (!clubFormData.name || !clubFormData.description || !clubFormData.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return false;
    }

    // Check if a club with this name already exists
    const { data: existingClubs, error: checkError } = await supabase
      .from('clubs')
      .select('id')
      .eq('name', clubFormData.name);
    
    if (checkError) {
      console.error('Error checking existing clubs:', checkError);
      throw new Error(checkError.message);
    }
    
    if (existingClubs && existingClubs.length > 0) {
      toast({
        title: 'Club Name Already Exists',
        description: 'Please choose a different club name.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return { validateClubData };
};
