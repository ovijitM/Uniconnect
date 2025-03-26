
import { useState, useEffect, useCallback } from 'react';
import { ClubFormData } from './types';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useClubFormState = () => {
  const { user } = useAuth();
  const { 
    userUniversity, 
    userUniversityId, 
    fetchUserProfile, 
    isLoadingProfile,
    error: profileError 
  } = useStudentProfile(user?.id);
  const { toast } = useToast();
  
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: '',
    university: '', // Will be populated from user profile
    universityId: '', // Will be populated from user profile
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
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the user's university when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  // Set the university from user profile when it's available
  // Only update if the values have changed to prevent infinite loops
  useEffect(() => {
    if (userUniversity && userUniversityId && 
        (clubFormData.university !== userUniversity || 
         clubFormData.universityId !== userUniversityId)) {
      setClubFormData(prev => ({
        ...prev,
        university: userUniversity,
        universityId: userUniversityId
      }));
    } else if (isClubDialogOpen && !isLoadingProfile && !profileError && (!userUniversity || !userUniversityId)) {
      // Only alert the user if they don't have a university associated with their profile
      // and we're not loading and there's no error
      toast({
        title: "Missing University Affiliation",
        description: "You need to have a university in your profile to create a club. Please update your profile first.",
        variant: "warning",
      });
      setIsClubDialogOpen(false); // Close the dialog
    } else if (isClubDialogOpen && profileError) {
      toast({
        title: "Profile Error",
        description: "Failed to load your university information. Please try again later or update your profile.",
        variant: "destructive",
      });
    }
  }, [userUniversity, userUniversityId, isClubDialogOpen, isLoadingProfile, profileError, toast, clubFormData.university, clubFormData.universityId]);

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

  // Provide profile loading state and error to consumer
  return {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    setIsSubmitting,
    handleClubInputChange,
    handleClubFileUpload,
    isLoadingProfile,
    profileError,
    retryProfileFetch: fetchUserProfile
  };
};
