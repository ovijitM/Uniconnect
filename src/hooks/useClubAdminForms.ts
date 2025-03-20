
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClubFormData {
  name: string;
  description: string;
  category: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: string;
  clubId: string;
}

export const useClubAdminForms = (userId: string | undefined, fetchClubAdminData: () => void) => {
  const { toast } = useToast();
  
  // Event form state
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
  
  // Club form state
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: ''
  });
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateClub = async () => {
    try {
      if (isSubmitting) return; // Prevent multiple submissions
      setIsSubmitting(true);

      if (!clubFormData.name || !clubFormData.description || !clubFormData.category) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Check if a club with this name already exists
      const { data: existingClubs, error: checkError } = await supabase
        .from('clubs')
        .select('id')
        .eq('name', clubFormData.name);
      
      if (checkError) {
        console.error('Error checking existing clubs:', checkError);
        throw new Error(checkError.message);
      }
      
      if (existingClubs && existingClubs.length > 0) {
        toast({
          title: 'Club Name Already Exists',
          description: 'Please choose a different club name.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // First, create the club
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .insert({
          name: clubFormData.name,
          description: clubFormData.description,
          category: clubFormData.category,
          logo_url: null,
        })
        .select();
      
      if (clubError) {
        console.error('Error creating club:', clubError);
        throw clubError;
      }
      
      if (!clubData || clubData.length === 0) {
        throw new Error('No club data returned after creation');
      }

      // Then, add the current user as an admin of the club
      const { error: adminError } = await supabase
        .from('club_admins')
        .insert({
          club_id: clubData[0].id,
          user_id: userId,
        });
      
      if (adminError) {
        console.error('Error adding club admin:', adminError);
        // If we fail to add admin, we should delete the club to avoid orphaned clubs
        await supabase.from('clubs').delete().eq('id', clubData[0].id);
        throw adminError;
      }
      
      toast({
        title: 'Success',
        description: 'Club created successfully!',
        variant: 'default',
      });
      
      // Reset form and close dialog
      setClubFormData({
        name: '',
        description: '',
        category: ''
      });
      setIsClubDialogOpen(false);
      
      // Refresh data
      fetchClubAdminData();
    } catch (error: any) {
      console.error('Error creating club:', error);
      toast({
        title: 'Error',
        description: 'Failed to create club. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
      fetchClubAdminData();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    handleCreateClub,
    handleCreateEvent,
    handleEventInputChange,
    handleClubInputChange
  };
};
