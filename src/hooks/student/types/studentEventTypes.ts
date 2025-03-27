
export interface StudentEventsState {
  isLoadingEvents: boolean;
  events: any[];
  registeredEvents: any[];
  registeredEventIds: string[];
  error: string | null;
}

export interface RegisterOptions {
  onSuccess?: () => void;
}
