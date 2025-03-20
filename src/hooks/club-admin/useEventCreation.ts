
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from './types';
import { useEventValidation } from './useEventValidation';

export const useEventCreation = (userId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const { validateEventData } = useEventValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert array-like string inputs to actual arrays
  const convertToArray = (value: string): string[] | null => {
    if (!value || !value.trim()) return null;
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  const createEvent = async (eventFormData: EventFormData, setEventFormData: React.Dispatch<React.SetStateAction<EventFormData>>, setIsEventDialogOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setIsSubmitting(true);
      
      // Check if the user has clubs if clubId is not set
      if (!eventFormData.clubId) {
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
          setIsSubmitting(false);
          return;
        }
      }
      
      // Validate form data
      if (!validateEventData(eventFormData, eventFormData.clubId)) {
        setIsSubmitting(false);
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
          status: 'upcoming',
          
          // New fields
          tagline: eventFormData.tagline || null,
          event_type: eventFormData.eventType,
          registration_deadline: eventFormData.registrationDeadline ? new Date(eventFormData.registrationDeadline).toISOString() : null,
          online_platform: eventFormData.onlinePlatform || null,
          eligibility: eventFormData.eligibility || null,
          team_size: eventFormData.teamSize || null,
          registration_link: eventFormData.registrationLink || null,
          entry_fee: eventFormData.entryFee || 'Free',
          theme: eventFormData.theme || null,
          sub_tracks: convertToArray(eventFormData.subTracks),
          prize_pool: eventFormData.prizePool || null,
          prize_categories: convertToArray(eventFormData.prizeCategories),
          additional_perks: convertToArray(eventFormData.additionalPerks),
          judging_criteria: convertToArray(eventFormData.judgingCriteria),
          judges: convertToArray(eventFormData.judges),
          deliverables: convertToArray(eventFormData.deliverables),
          submission_platform: eventFormData.submissionPlatform || null,
          mentors: convertToArray(eventFormData.mentors),
          sponsors: convertToArray(eventFormData.sponsors),
          contact_email: eventFormData.contactEmail || null,
          community_link: eventFormData.communityLink || null,
          event_website: eventFormData.eventWebsite || null,
          event_hashtag: eventFormData.eventHashtag || null
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
        clubId: '',
        tagline: '',
        eventType: 'in-person',
        registrationDeadline: '',
        onlinePlatform: '',
        eligibility: '',
        teamSize: '',
        registrationLink: '',
        entryFee: 'Free',
        theme: '',
        subTracks: '',
        prizePool: '',
        prizeCategories: '',
        additionalPerks: '',
        judgingCriteria: '',
        judges: '',
        deliverables: '',
        submissionPlatform: '',
        mentors: '',
        sponsors: '',
        contactEmail: '',
        communityLink: '',
        eventWebsite: '',
        eventHashtag: ''
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createEvent
  };
};
