
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from './types';

export const useEventForm = (userId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
    clubId: ''
  });
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async () => {
    try {
      if (!eventFormData.clubId) {
        // If no club is selected and there are clubs available
        const { data: clubsData } = await supabase
          .from('club_admins')
          .select('club_id')
          .eq('user_id', userId);
          
        if (clubsData && clubsData.length > 0) {
          eventFormData.clubId = clubsData[0].club_id;
        } else {
          toast({
            title: 'Error',
            description: 'You must create a club first before creating events.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Validate required fields
      if (!eventFormData.title || !eventFormData.description || !eventFormData.date || 
          !eventFormData.location || !eventFormData.category) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventFormData.title,
          description: eventFormData.description,
          date: new Date(eventFormData.date).toISOString(),
          location: eventFormData.location,
          category: eventFormData.category,
          max_participants: eventFormData.maxParticipants ? parseInt(eventFormData.maxParticipants) : null,
          club_id: eventFormData.clubId,
          status: 'upcoming'
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Event created successfully!',
        variant: 'default',
      });
      
      // Reset form and close dialog
      setEventFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        maxParticipants: '',
        clubId: ''
      });
      setIsEventDialogOpen(false);
      
      // Refresh event data
      onSuccess();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleEventInputChange,
    handleCreateEvent
  };
};
