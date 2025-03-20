
import { supabase } from '@/integrations/supabase/client';
import { Attendee, EventParticipantWithProfile } from '../types';

export const fetchEventAttendees = async (eventId: string): Promise<Attendee[]> => {
  console.log("Fetching attendees for event:", eventId);
  
  // Get all participants for the event and their profile information
  const { data, error } = await supabase
    .from('event_participants')
    .select(`
      created_at,
      event_id,
      user_id,
      checked_in,
      checked_in_at,
      profiles:user_id(
        id,
        name,
        email,
        profile_image
      )
    `)
    .eq('event_id', eventId);
  
  if (error) throw error;
  
  console.log(`Retrieved ${data?.length || 0} attendees`, data);
  
  // Transform the data to the desired format with proper type checking
  const formattedAttendees = (data as unknown as EventParticipantWithProfile[]).map(item => {
    // Create a properly typed attendee object
    const attendee: Attendee = {
      id: item.user_id + item.event_id, // Create a composite ID
      user_id: item.user_id,
      event_id: item.event_id,
      created_at: item.created_at,
      checked_in: Boolean(item.checked_in || false),
      checked_in_at: item.checked_in_at || null,
      name: item.profiles?.name || 'Unknown',
      email: item.profiles?.email || 'No email',
      profile_image: item.profiles?.profile_image || null
    };
    return attendee;
  });
  
  return formattedAttendees;
};
