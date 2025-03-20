
import { supabase } from '@/integrations/supabase/client';

export const checkInAttendee = async (userId: string, eventId: string): Promise<boolean> => {
  console.log("Checking in attendee:", userId);
  
  // Update the event_participants table with the checked_in status
  const { error } = await supabase
    .from('event_participants')
    .update({
      checked_in: true,
      checked_in_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('event_id', eventId);
  
  if (error) throw error;
  
  return true;
};
