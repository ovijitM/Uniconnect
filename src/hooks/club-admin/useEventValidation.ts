
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from './types';

export const useEventValidation = () => {
  const { toast } = useToast();

  const validateEventData = (eventFormData: EventFormData, clubId?: string): boolean => {
    // Validate required basic fields
    if (!eventFormData.title || !eventFormData.description || !eventFormData.date || 
        !eventFormData.location || !eventFormData.category) {
      toast({
        title: 'Missing Basic Information',
        description: 'Please fill in all required basic fields (title, description, date, location, category).',
        variant: 'destructive',
      });
      return false;
    }
    
    // Validate details fields
    if (!eventFormData.tagline || !eventFormData.eventType || !eventFormData.registrationDeadline) {
      toast({
        title: 'Missing Event Details',
        description: 'Please provide event tagline, type, and registration deadline.',
        variant: 'destructive',
      });
      return false;
    }
    
    // Validate logistics fields
    if (!eventFormData.eligibility || !eventFormData.teamSize || 
        !eventFormData.maxParticipants || !eventFormData.contactEmail) {
      toast({
        title: 'Missing Logistics Information',
        description: 'Please complete logistics information (eligibility, team size, max participants, contact email).',
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
