
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from './types';

export const useEventValidation = () => {
  const { toast } = useToast();

  const validateEventData = (eventFormData: EventFormData, clubId?: string): boolean => {
    // Validate required fields
    if (!eventFormData.title || !eventFormData.description || !eventFormData.date || 
        !eventFormData.location || !eventFormData.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return false;
    }
    
    // If no club is selected
    if (!eventFormData.clubId && !clubId) {
      toast({
        title: 'Club Required',
        description: 'You must select a club for this event.',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  return { validateEventData };
};
