
import { useState } from 'react';
import { ClubFormData, EventFormData } from './types'; // Updated to import types from types.ts

export const useClubAdminForms = (userId?: string, onRefresh?: () => Promise<void>) => {
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  // Initialize with empty form data
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    logoUrl: '',
    category: 'academic',
  });
  
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'workshop',
    maxParticipants: '',
    clubId: '',
    imageUrl: '',
    tagline: '', // Now required
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
    eventHashtag: '',
    visibility: 'public' // Required field with default value
  });

  // Handle input changes for club form
  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle input changes for event form
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload for club form
  const handleClubFileUpload = (url: string, fileName: string) => {
    setClubFormData(prev => ({
      ...prev,
      documentUrl: url,
      documentName: fileName,
    }));
  };

  // Handle file upload for event form
  const handleEventFileUpload = (url: string, fileName: string) => {
    setEventFormData(prev => ({
      ...prev,
      documentUrl: url,
      documentName: fileName,
    }));
  };
  
  // Create a new club
  const handleCreateClub = async () => {
    // Implementation should be handled in the component that uses this hook
    console.log('Creating club with data:', clubFormData);
    
    // Close the dialog
    setIsClubDialogOpen(false);
    
    // Reset form data
    setClubFormData({
      name: '',
      description: '',
      logoUrl: '',
      category: 'academic',
    });
    
    // Refresh club data if callback provided
    if (onRefresh) {
      await onRefresh();
    }
  };
  
  // Create a new event
  const handleCreateEvent = async () => {
    // Implementation should be handled in the component that uses this hook
    console.log('Creating event with data:', eventFormData);
    
    // Close the dialog
    setIsEventDialogOpen(false);
    
    // Reset form data
    setEventFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      category: 'workshop',
      maxParticipants: '',
      clubId: '',
      imageUrl: '',
      tagline: '', // Required field
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
      eventHashtag: '',
      visibility: 'public' // Required field
    });
    
    // Refresh event data if callback provided
    if (onRefresh) {
      await onRefresh();
    }
  };

  return {
    clubFormData,
    eventFormData,
    isClubDialogOpen,
    isEventDialogOpen,
    setIsClubDialogOpen,
    setIsEventDialogOpen,
    handleClubInputChange,
    handleEventInputChange,
    handleCreateClub,
    handleCreateEvent,
    handleClubFileUpload,
    handleEventFileUpload
  };
};
