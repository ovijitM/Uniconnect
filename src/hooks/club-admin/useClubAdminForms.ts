
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventFormData, ClubFormData } from './types';
import { useClubCreation } from './useClubCreation';
import { useEventCreation } from './useEventCreation';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';

export const useClubAdminForms = (userId: string | undefined, onSuccess: () => void) => {
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    eventType: 'in-person',
    maxParticipants: '',
    registrationDeadline: '',
    imageUrl: '',
    status: 'upcoming',
    visibility: 'public',
    onlinePlatform: '',
    entryFee: 'Free',
    tagline: '',
  });
  
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: '',
    university: '',
    universityId: '',
    tagline: '',
    establishedYear: '',
    affiliation: '',
    whyJoin: '',
    regularEvents: '',
    signatureEvents: '',
    communityEngagement: '',
    whoCanJoin: '',
    membershipFee: 'Free',
    howToJoin: '',
    presidentName: '',
    presidentContact: '',
    executiveMembers: '',
    advisors: '',
    phoneNumber: '',
    website: '',
    facebookLink: '',
    instagramLink: '',
    twitterLink: '',
    discordLink: '',
    logoUrl: '',
    documentUrl: '',
    documentName: ''
  });
  
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingClub, setHasExistingClub] = useState(false);
  const [isCheckingClubs, setIsCheckingClubs] = useState(false);
  
  const { toast } = useToast();
  const { createClub } = useClubCreation();
  const { createEvent } = useEventCreation();
  
  const { userUniversity, userUniversityId, fetchUserProfile, isLoadingProfile } = useStudentProfile(userId);
  
  // Check if user already has a club
  const checkUserHasClub = async () => {
    if (!userId) return;
    
    try {
      setIsCheckingClubs(true);
      const { data, error } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error checking if user has a club:', error);
        toast({
          title: 'Error',
          description: 'Failed to check if you already have a club',
          variant: 'destructive',
        });
        throw error;
      }
      
      setHasExistingClub(data !== null && data.length > 0);
    } catch (error) {
      console.error('Error in checkUserHasClub:', error);
    } finally {
      setIsCheckingClubs(false);
    }
  };
  
  // Update university info when available
  useEffect(() => {
    if (userUniversity && userUniversityId) {
      setClubFormData(prev => ({
        ...prev,
        university: userUniversity,
        universityId: userUniversityId
      }));
    }
  }, [userUniversity, userUniversityId]);
  
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      checkUserHasClub();
    }
  }, [userId]);
  
  // Event form handlers
  const handleEventInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleEventFileUpload = useCallback((url: string) => {
    setEventFormData(prev => ({ ...prev, imageUrl: url }));
  }, []);
  
  // Club form handlers
  const handleClubInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleClubFileUpload = useCallback((url: string, fileName: string, type: 'logo' | 'document' = 'document') => {
    if (type === 'logo') {
      setClubFormData(prev => ({ ...prev, logoUrl: url }));
    } else {
      setClubFormData(prev => ({ 
        ...prev, 
        documentUrl: url,
        documentName: fileName
      }));
    }
  }, []);
  
  // Create event handler
  const handleCreateEvent = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'You must be logged in to create an event',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Validate required fields
      if (!eventFormData.title || !eventFormData.description || !eventFormData.date || !eventFormData.location || !eventFormData.category) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields: title, description, date, location, and category.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // First get the user's club ID
      const { data: adminData, error: adminError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId)
        .single();
      
      if (adminError) {
        console.error('Error getting admin club:', adminError);
        toast({
          title: 'Error',
          description: 'Failed to find your club. You must have a club to create events.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      const clubId = adminData.club_id;
      
      // Create the event
      const success = await createEvent(eventFormData, clubId);
      
      if (success) {
        toast({
          title: 'Event Created',
          description: 'Your event has been created successfully.',
        });
        
        // Reset form and close dialog
        setEventFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          category: '',
          eventType: 'in-person',
          maxParticipants: '',
          registrationDeadline: '',
          imageUrl: '',
          status: 'upcoming',
          visibility: 'public',
          onlinePlatform: '',
          entryFee: 'Free',
          tagline: '',
        });
        setIsEventDialogOpen(false);
        
        // Refresh data
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create event. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error in handleCreateEvent:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating the event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Create club handler
  const handleCreateClub = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'You must be logged in to create a club',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if user already has a club
      await checkUserHasClub();
      
      if (hasExistingClub) {
        toast({
          title: 'Club Limit Reached',
          description: 'You can only be an admin for one club. Please manage your existing club.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      // Logging form data before submission
      console.log('Club form data before submission:', clubFormData);
      
      // Create the club
      const success = await createClub(clubFormData, userId);
      
      if (success) {
        toast({
          title: 'Club Created',
          description: 'Your club has been created successfully and is pending approval.',
        });
        
        // Reset form and close dialog
        setClubFormData({
          name: '',
          description: '',
          category: '',
          university: userUniversity || '',
          universityId: userUniversityId || '',
          tagline: '',
          establishedYear: '',
          affiliation: '',
          whyJoin: '',
          regularEvents: '',
          signatureEvents: '',
          communityEngagement: '',
          whoCanJoin: '',
          membershipFee: 'Free',
          howToJoin: '',
          presidentName: '',
          presidentContact: '',
          executiveMembers: '',
          advisors: '',
          phoneNumber: '',
          website: '',
          facebookLink: '',
          instagramLink: '',
          twitterLink: '',
          discordLink: '',
          logoUrl: '',
          documentUrl: '',
          documentName: ''
        });
        setIsClubDialogOpen(false);
        
        // Set hasExistingClub to true to prevent creating multiple clubs
        setHasExistingClub(true);
        
        // Refresh data
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create club. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error in handleCreateClub:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating the club. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    eventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    clubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    handleCreateClub,
    handleCreateEvent,
    handleEventInputChange,
    handleClubInputChange,
    handleClubFileUpload,
    handleEventFileUpload,
    hasExistingClub,
    isCheckingClubs,
    checkUserHasClub,
    isSubmitting,
    isLoadingProfile
  };
};
