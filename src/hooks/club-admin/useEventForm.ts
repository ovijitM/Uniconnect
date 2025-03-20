
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
    clubId: '',
    
    // Initialize new fields
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
      
      // Convert array-like string inputs to actual arrays
      const convertToArray = (value: string): string[] | null => {
        if (!value.trim()) return null;
        return value.split(',').map(item => item.trim()).filter(Boolean);
      };
      
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
