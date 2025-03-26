
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ClubFormData, EventFormData } from './types';
import { useClubCreation } from './useClubCreation';
import { useEventCreation } from './useEventCreation';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';

export const useClubAdminForms = (userId: string | undefined, onClubCreationSuccess: () => void) => {
  const { toast } = useToast();
  const { userUniversity, userUniversityId, fetchUserProfile } = useStudentProfile(userId);
  const { createClub } = useClubCreation(userId, onClubCreationSuccess);
  const { createEvent } = useEventCreation(userId, onClubCreationSuccess);
  
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    tagline: '',
    category: '',
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
    university: '',
    universityId: '',
    logoUrl: '',
    documentUrl: '',
    documentName: ''
  });

  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    tagline: '',
    description: '',
    date: '',
    location: '',
    category: '',
    clubId: '',
    maxParticipants: '',
    registrationDeadline: '',
    imageUrl: '',
    eventType: 'in-person',
    entryFee: 'Free',
    howToRegister: '',
    visibility: 'public',
    onlinePlatform: '',
    eligibility: '',
    teamSize: '',
    registrationLink: '',
    theme: '',
    subTracks: '',
    prizePool: '',
    prizeCategories: '',
    additionalPerks: '',
    judgingCriteria: '',
    judges: '',
    schedule: '',
    deliverables: '',
    submissionPlatform: '',
    mentors: '',
    sponsors: '',
    contactEmail: '',
    communityLink: '',
    eventWebsite: '',
    eventHashtag: ''
  });
  
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, fetchUserProfile]);
  
  useEffect(() => {
    if (userUniversity && userUniversityId && !clubFormData.university) {
      setClubFormData(prev => ({
        ...prev,
        university: userUniversity,
        universityId: userUniversityId
      }));
    }
  }, [userUniversity, userUniversityId, clubFormData.university]);

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleClubFileUpload = (url: string, fileName: string, type?: 'logo' | 'document') => {
    console.log(`Club ${type} uploaded:`, url, fileName);
    
    if (type === 'logo') {
      setClubFormData(prev => ({
        ...prev,
        logoUrl: url
      }));
    } else if (type === 'document') {
      setClubFormData(prev => ({
        ...prev,
        documentUrl: url,
        documentName: fileName
      }));
    }
  };
  
  const handleEventFileUpload = (url: string, fileName: string) => {
    console.log("Event image uploaded:", url, fileName);
    setEventFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };
  
  const handleCreateClub = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Creating club with data:", clubFormData);
      // Explicitly pass userId and true for the callback execution
      await createClub(clubFormData, userId, true);
      
      toast({
        title: "Club Created",
        description: "Your club has been created and is pending approval."
      });
      
      setIsClubDialogOpen(false);
      
      setClubFormData({
        ...clubFormData,
        name: '',
        description: '',
        tagline: '',
        category: '',
        logoUrl: '',
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
        documentUrl: '',
        documentName: ''
      });
      
      if (onClubCreationSuccess) {
        console.log("Calling onClubCreationSuccess callback to refresh clubs");
        setTimeout(() => {
          onClubCreationSuccess();
        }, 500);
      }
    } catch (error) {
      console.error("Error creating club:", error);
      toast({
        title: "Error",
        description: "Failed to create club. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateEvent = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Creating event with data:", eventFormData);
      
      // Explicitly pass the required arguments
      await createEvent(eventFormData, setEventFormData, setIsEventDialogOpen);
      
      toast({
        title: "Event Created",
        description: "Your event has been created successfully."
      });
      
      setIsEventDialogOpen(false);
      
      const clubId = eventFormData.clubId;
      setEventFormData({
        title: '',
        tagline: '',
        description: '',
        date: '',
        location: '',
        category: '',
        clubId: clubId,
        maxParticipants: '',
        registrationDeadline: '',
        imageUrl: '',
        eventType: 'in-person',
        entryFee: 'Free',
        howToRegister: '',
        visibility: 'public',
        onlinePlatform: '',
        eligibility: '',
        teamSize: '',
        registrationLink: '',
        theme: '',
        subTracks: '',
        prizePool: '',
        prizeCategories: '',
        additionalPerks: '',
        judgingCriteria: '',
        judges: '',
        schedule: '',
        deliverables: '',
        submissionPlatform: '',
        mentors: '',
        sponsors: '',
        contactEmail: '',
        communityLink: '',
        eventWebsite: '',
        eventHashtag: ''
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    handleClubInputChange,
    handleCreateClub,
    handleClubFileUpload,
    eventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleEventInputChange,
    handleCreateEvent,
    handleEventFileUpload,
    isSubmitting
  };
};
