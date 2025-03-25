
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Attendee } from './attendees/types';
import { fetchEventAttendees } from './attendees/utils/fetchAttendees';
import { checkInAttendee as checkInAttendeeUtil } from './attendees/utils/checkInAttendee';
import { exportAttendeesToCSV } from './attendees/utils/exportAttendees';

export type { Attendee };

export const useEventAttendees = (eventId: string) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAttendees = async () => {
    if (!eventId) return;
    
    setIsLoading(true);
    try {
      const formattedAttendees = await fetchEventAttendees(eventId);
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
      const success = await checkInAttendeeUtil(attendeeId, eventId);
      
      // Update local state
      if (success) {
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
      }
      
      return success;
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
      try {
        exportAttendeesToCSV(eventId, attendees);
        
        toast({
          title: 'Export successful',
          description: 'Attendee list downloaded as CSV.',
        });
      } catch (error) {
        console.error('Error exporting attendees:', error);
        toast({
          title: 'Export failed',
          description: 'Failed to export attendees.',
          variant: 'destructive',
        });
      }
    } else if (format === 'pdf') {
      // For PDF, we'll just show a toast message for now
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
