
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from './types';

export const useEventValidation = () => {
  const { toast } = useToast();

  const validateEventData = (eventFormData: EventFormData, clubId: string): boolean => {
    // Check for required fields
    if (!eventFormData.title.trim()) {
      toast({
        title: 'Missing Title',
        description: 'Please provide a title for the event.',
        variant: 'destructive',
      });
      return false;
    }

    if (!eventFormData.description.trim()) {
      toast({
        title: 'Missing Description',
        description: 'Please provide a description for the event.',
        variant: 'destructive',
      });
      return false;
    }

    if (!eventFormData.date.trim()) {
      toast({
        title: 'Missing Date',
        description: 'Please select a date for the event.',
        variant: 'destructive',
      });
      return false;
    }

    if (!eventFormData.location.trim()) {
      toast({
        title: 'Missing Location',
        description: 'Please provide a location for the event.',
        variant: 'destructive',
      });
      return false;
    }

    if (!eventFormData.category.trim()) {
      toast({
        title: 'Missing Category',
        description: 'Please provide a category for the event.',
        variant: 'destructive',
      });
      return false;
    }

    if (!clubId) {
      toast({
        title: 'Club Selection Required',
        description: 'Please select a club for this event.',
        variant: 'destructive',
      });
      return false;
    }

    // Check if the date is in the future
    const eventDate = new Date(eventFormData.date);
    const currentDate = new Date();

    if (eventDate < currentDate) {
      toast({
        title: 'Invalid Date',
        description: 'The event date must be in the future.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return { validateEventData };
};
