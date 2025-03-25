import { useEventFetch } from './event-detail/useEventFetch';
import { useEventParticipation } from './event-detail/useEventParticipation';

export const useEventDetail = (eventId?: string) => {
  const { event, setEvent, isLoading } = useEventFetch(eventId);
  const { isParticipating, handleParticipate, handleUnregister } = useEventParticipation(
    eventId,
    event,
    setEvent
  );

  return {
    event,
    isLoading,
    isParticipating,
    handleParticipate,
    handleUnregister
  };
};
