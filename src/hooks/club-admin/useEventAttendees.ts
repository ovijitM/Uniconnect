
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Attendee {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  checked_in: boolean;
  checked_in_at: string | null;
  name: string;
  email: string;
  profile_image: string | null;
}

// Define an interface for the raw data returned from Supabase
interface EventParticipantWithProfile {
  created_at: string;
  event_id: string;
  user_id: string;
  checked_in: boolean | null;
  checked_in_at: string | null;
  profiles: {
    id: string;
    name: string;
    email: string;
    profile_image: string | null;
  } | null;
}

export const useEventAttendees = (eventId: string) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAttendees = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching attendees for event:", eventId);
      
      // Get all participants for the event and their profile information
      // Fix: Use proper relation by fetching user profiles directly
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
      
      setAttendees(formattedAttendees);
    } catch (error) {
      console.error('Error fetching attendees:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attendees. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkInAttendee = async (attendeeId: string) => {
    try {
      console.log("Checking in attendee:", attendeeId);
      
      // Update the event_participants table with the checked_in status
      const { error } = await supabase
        .from('event_participants')
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString()
        })
        .eq('user_id', attendeeId)
        .eq('event_id', eventId);
      
      if (error) throw error;
      
      // Update local state
      setAttendees(prev => 
        prev.map(attendee => 
          attendee.user_id === attendeeId 
            ? { 
                ...attendee, 
                checked_in: true,
                checked_in_at: new Date().toISOString()
              } 
            : attendee
        )
      );
      
      toast({
        title: 'Success',
        description: 'Attendee checked in successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error checking in attendee:', error);
      toast({
        title: 'Error',
        description: 'Failed to check in attendee. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const exportAttendees = async (format: 'csv' | 'pdf') => {
    if (attendees.length === 0) {
      toast({
        title: 'No data',
        description: 'There are no attendees to export.',
        variant: 'destructive',
      });
      return;
    }

    if (format === 'csv') {
      // Create CSV content
      const headers = ['Name', 'Email', 'Registration Date', 'Checked In', 'Check-in Time'];
      const csvRows = [
        headers.join(','),
        ...attendees.map(attendee => [
          `"${attendee.name}"`,
          `"${attendee.email}"`,
          `"${new Date(attendee.created_at).toLocaleString()}"`,
          `"${attendee.checked_in ? 'Yes' : 'No'}"`,
          `"${attendee.checked_in_at ? new Date(attendee.checked_in_at).toLocaleString() : 'N/A'}"`
        ].join(','))
      ];
      const csvContent = csvRows.join('\n');
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `event-attendees-${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Export successful',
        description: 'Attendee list downloaded as CSV.',
      });
    } else if (format === 'pdf') {
      // For PDF, we'll just show a toast message for now
      // In a real implementation, this would use a PDF generation library
      toast({
        title: 'PDF Export',
        description: 'PDF export functionality is coming soon.',
      });
    }
  };

  return {
    attendees,
    isLoading,
    fetchAttendees,
    checkInAttendee,
    exportAttendees
  };
};
