
import { useState } from 'react';

export interface ClubFormData {
  name: string;
  description: string;
  logoUrl: string;
  category: string;
  tagline?: string;
  establishedYear?: string;
  affiliation?: string;
  whyJoin?: string;
  regularEvents?: string;
  signatureEvents?: string;
  communityEngagement?: string;
  whoCanJoin?: string;
  membershipFee?: string;
  howToJoin?: string;
  presidentName?: string;
  presidentContact?: string;
  phoneNumber?: string;
  website?: string;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  discordLink?: string;
  documentUrl?: string;
  documentName?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  maxParticipants: string;
  clubId: string;
  imageUrl?: string;
  tagline?: string;
  eventType?: string;
  registrationDeadline?: string;
  onlinePlatform?: string;
  eligibility?: string;
  teamSize?: string;
  registrationLink?: string;
  entryFee?: string;
  theme?: string;
  subTracks?: string;
  prizePool?: string;
  prizeCategories?: string;
  additionalPerks?: string;
  judgingCriteria?: string;
  judges?: string;
  deliverables?: string;
  submissionPlatform?: string;
  mentors?: string;
  sponsors?: string;
  contactEmail?: string;
  communityLink?: string;
  eventWebsite?: string;
  eventHashtag?: string;
  documentUrl?: string;
  documentName?: string;
}

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
