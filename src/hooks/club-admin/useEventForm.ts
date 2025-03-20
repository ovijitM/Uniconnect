
import { useEventFormState } from './useEventFormState';
import { useEventCreation } from './useEventCreation';

export const useEventForm = (userId: string | undefined, onSuccess: () => void) => {
  const {
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleEventInputChange
  } = useEventFormState();

  const { isSubmitting, createEvent } = useEventCreation(userId, onSuccess);

  const handleCreateEvent = async () => {
    await createEvent(eventFormData, setEventFormData, setIsEventDialogOpen);
  };

  return {
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    isSubmitting,
    handleEventInputChange,
    handleCreateEvent
  };
};
