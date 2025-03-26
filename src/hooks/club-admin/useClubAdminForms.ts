
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData, EventFormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useClubValidation } from './useClubValidation';
import { useEventValidation } from './useEventValidation';
import { isNetworkError, parseArrayField } from './utils/dataTransformUtils';

export const useClubAdminForms = (userId: string | undefined, fetchClubAdminData: () => Promise<void>) => {
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
    clubId: '',
    imageUrl: '',
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
    schedule: '',
    deliverables: '',
    submissionPlatform: '',
    mentors: '',
    sponsors: '',
    contactEmail: '',
    communityLink: '',
    eventWebsite: '',
    eventHashtag: '',
    howToRegister: '',
    visibility: 'public'
  });
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: '',
    logoUrl: '',
    university: '',
    tagline: '',
    establishedYear: '',
    affiliation: '',
    whyJoin: '',
    regularEvents: '',
    signatureEvents: '',
    communityEngagement: '',
    whoCanJoin: '',
    membershipFee: '',
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
    documentName: '',
    // Additional fields
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMediaLinks: {
      website: '',
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      discord: ''
    },
    achievements: '',
    documents: {
      constitution: '',
      codeOfConduct: '',
      other: ''
    },
    missionStatement: '',
    visionStatement: '',
    values: '',
    foundingDate: '',
    clubType: '',
    studentCount: '',
    facultyAdvisor: '',
    budgetInfo: '',
    meetingInfo: '',
    additionalNotes: ''
  });
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [hasExistingClub, setHasExistingClub] = useState(false);
  const [isCheckingClubs, setIsCheckingClubs] = useState(true);
  const { toast } = useToast();
  const { validateClubData } = useClubValidation();
  const { validateEventData } = useEventValidation();

  const handleCreateClub = async () => {
    try {
      console.log("Attempting to create club with data:", clubFormData);

      if (!validateClubData(clubFormData)) {
        console.error("Club data validation failed");
        return;
      }

      const { data, error } = await supabase
        .from('clubs')
        .insert([
          {
            name: clubFormData.name,
            description: clubFormData.description,
            category: clubFormData.category,
            logo_url: clubFormData.logoUrl,
            university_id: clubFormData.university,
            contact_email: clubFormData.contactEmail,
            contact_phone: clubFormData.contactPhone,
            address: clubFormData.address,
            social_media_links: clubFormData.socialMediaLinks,
            executive_members: clubFormData.executiveMembers,
            achievements: clubFormData.achievements,
            documents: clubFormData.documents,
            mission_statement: clubFormData.missionStatement,
            vision_statement: clubFormData.visionStatement,
            values: clubFormData.values,
            founding_date: clubFormData.foundingDate,
            club_type: clubFormData.clubType,
            student_count: clubFormData.studentCount,
            faculty_advisor: clubFormData.facultyAdvisor,
            budget_info: clubFormData.budgetInfo,
            meeting_info: clubFormData.meetingInfo,
            additional_notes: clubFormData.additionalNotes,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating club:", error);
        toast({
          title: "Error",
          description: "Failed to create club. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Club created successfully:", data);
      toast({
        title: "Success",
        description: "Club created successfully!",
      });

      setIsClubDialogOpen(false);
      setClubFormData({
        name: '',
        description: '',
        category: '',
        logoUrl: '',
        university: '',
        tagline: '',
        establishedYear: '',
        affiliation: '',
        whyJoin: '',
        regularEvents: '',
        signatureEvents: '',
        communityEngagement: '',
        whoCanJoin: '',
        membershipFee: '',
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
        documentName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        socialMediaLinks: {
          website: '',
          instagram: '',
          facebook: '',
          twitter: '',
          linkedin: '',
          discord: ''
        },
        achievements: '',
        documents: {
          constitution: '',
          codeOfConduct: '',
          other: ''
        },
        missionStatement: '',
        visionStatement: '',
        values: '',
        foundingDate: '',
        clubType: '',
        studentCount: '',
        facultyAdvisor: '',
        budgetInfo: '',
        meetingInfo: '',
        additionalNotes: ''
      });

      // Refresh club admin data
      await fetchClubAdminData();
    } catch (error: any) {
      console.error("Error creating club:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create club. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateEvent = async (collaborators: string[] = []) => {
    try {
      console.log('Creating event with data:', eventFormData);
      console.log('User ID:', userId);

      if (!userId) {
        toast({
          title: 'Error',
          description: 'User ID is missing. Please log in again.',
          variant: 'destructive',
        });
        return;
      }

      if (!eventFormData.clubId) {
        const { data: clubsData, error: clubsError } = await supabase
          .from('club_admins')
          .select('club_id')
          .eq('user_id', userId);

        if (clubsError) {
          console.error('Error fetching user clubs:', clubsError);
          toast({
            title: 'Error',
            description: 'Failed to fetch your clubs. Please try again.',
            variant: 'destructive',
          });
          return;
        }

        if (clubsData && clubsData.length > 0) {
          eventFormData.clubId = clubsData[0].club_id;
          console.log('Using first club ID:', eventFormData.clubId);
        } else {
          toast({
            title: 'Error',
            description: 'You must create a club first before creating events.',
            variant: 'destructive',
          });
          return;
        }
      }

      if (!validateEventData(eventFormData, eventFormData.clubId)) {
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
          image_url: eventFormData.imageUrl || null,
          visibility: eventFormData.visibility,
          tagline: eventFormData.tagline || null,
          event_type: eventFormData.eventType,
          registration_deadline: eventFormData.registrationDeadline ? new Date(eventFormData.registrationDeadline).toISOString() : null,
          online_platform: eventFormData.onlinePlatform || null,
          eligibility: eventFormData.eligibility || null,
          team_size: eventFormData.teamSize || null,
          registration_link: eventFormData.registrationLink || null,
          entry_fee: eventFormData.entryFee || 'Free',
          theme: eventFormData.theme || null,
          sub_tracks: eventFormData.subTracks ? parseArrayField(eventFormData.subTracks) : null,
          prize_pool: eventFormData.prizePool || null,
          prize_categories: eventFormData.prizeCategories ? parseArrayField(eventFormData.prizeCategories) : null,
          additional_perks: eventFormData.additionalPerks ? parseArrayField(eventFormData.additionalPerks) : null,
          judging_criteria: eventFormData.judgingCriteria ? parseArrayField(eventFormData.judgingCriteria) : null,
          judges: eventFormData.judges ? parseArrayField(eventFormData.judges) : null,
          deliverables: eventFormData.deliverables ? parseArrayField(eventFormData.deliverables) : null,
          submission_platform: eventFormData.submissionPlatform || null,
          mentors: eventFormData.mentors ? parseArrayField(eventFormData.mentors) : null,
          sponsors: eventFormData.sponsors ? parseArrayField(eventFormData.sponsors) : null,
          contact_email: eventFormData.contactEmail || null,
          community_link: eventFormData.communityLink || null,
          event_website: eventFormData.eventWebsite || null,
          event_hashtag: eventFormData.eventHashtag || null,
          schedule: eventFormData.schedule ? JSON.parse(eventFormData.schedule) : null
        })
        .select();

      if (error) {
        console.error('Error creating event:', error);
        toast({
          title: 'Error Creating Event',
          description: `Failed to create event: ${error.message || 'Please try again.'}`,
          variant: 'destructive',
        });
        return;
      }

      console.log('Event created successfully:', data);

      if (collaborators.length > 0 && data && data.length > 0) {
        const eventId = data[0].id;

        const collaboratorEntries = collaborators.map(clubId => ({
          event_id: eventId,
          club_id: clubId
        }));

        const { error: collaboratorsError } = await supabase
          .from('event_collaborators')
          .insert(collaboratorEntries);

        if (collaboratorsError) {
          console.error('Error adding collaborators:', collaboratorsError);
        }
      }

      toast({
        title: 'Success',
        description: 'Event created successfully!',
        variant: 'default',
      });

      setEventFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        maxParticipants: '',
        clubId: '',
        imageUrl: '',
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
        schedule: '',
        deliverables: '',
        submissionPlatform: '',
        mentors: '',
        sponsors: '',
        contactEmail: '',
        communityLink: '',
        eventWebsite: '',
        eventHashtag: '',
        howToRegister: '',
        visibility: 'public'
      });
      setIsEventDialogOpen(false);

      // Refresh club admin data
      await fetchClubAdminData();
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: `Failed to create event: ${error.message || 'Please try again.'}`,
        variant: 'destructive',
      });
    }
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClubFileUpload = async (url: string, fileName: string, type: 'logo' | 'document' = 'logo') => {
    if (type === 'logo') {
      setClubFormData(prev => ({ ...prev, logoUrl: url }));
    } else {
      // Handle document uploads if needed
      console.log(`Document uploaded: ${fileName} at ${url}`);
    }
  };

  const handleEventFileUpload = async (url: string, fileName: string) => {
    setEventFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const checkUserHasClub = useCallback(async () => {
    if (!userId) {
      setIsCheckingClubs(false);
      return;
    }

    setIsCheckingClubs(true);
    try {
      const { data, error } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId);

      if (error) {
        console.error("Error checking user's clubs:", error);
        if (isNetworkError(error)) {
          toast({
            title: "Connection Error",
            description: "Could not check for existing clubs. Please check your network connection.",
            variant: "destructive",
          });
        }
        return;
      }

      const userHasClub = data && data.length > 0;
      setHasExistingClub(userHasClub);
    } catch (error: any) {
      console.error("Error checking user's clubs:", error);
      toast({
        title: "Error",
        description: "Failed to check for existing clubs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingClubs(false);
    }
  }, [userId, toast]);

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
    checkUserHasClub
  };
};
