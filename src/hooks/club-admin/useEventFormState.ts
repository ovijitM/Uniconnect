
import { useState } from 'react';
import { EventFormData } from './types';

export const useEventFormState = () => {
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
    clubId: '',
    imageUrl: '', // Added field for event banner/poster
    
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

  return {
    eventFormData,
    setEventFormData,
    isEventDialogOpen,
    setIsEventDialogOpen,
    handleEventInputChange
  };
};
