
import { useState, useEffect } from 'react';
import { ClubFormData } from '@/hooks/club-admin/types';
import { useClubCreation } from '@/hooks/club-admin/useClubCreation';
import { useClubValidation } from '@/hooks/club-admin/useClubValidation';
import { useToast } from '@/hooks/use-toast';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminClubCreation = (userId: string | undefined, onSuccess: () => void) => {
  const { user } = useAuth();
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
  
  // Get university information if available
  const { userUniversity, userUniversityId, fetchUserProfile, isLoadingProfile, error: profileError } = useStudentProfile(userId);
  
  // Set university info from user profile only once when it becomes available
  useEffect(() => {
    if (userUniversity && userUniversityId && 
        (!clubFormData.university || !clubFormData.universityId)) {
      setClubFormData(prev => ({
        ...prev, 
        university: userUniversity,
        universityId: userUniversityId
      }));
      console.log('Set university from user profile:', userUniversity, 'with ID:', userUniversityId);
    }
  }, [userUniversity, userUniversityId]);
  
  // Fetch user profile when component mounts
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, fetchUserProfile]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { validateClubData } = useClubValidation();
  const { createClub } = useClubCreation();

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (url: string, fileName: string, type: 'logo' | 'document' = 'document') => {
    if (type === 'logo') {
      setClubFormData(prev => ({ ...prev, logoUrl: url }));
    } else {
      setClubFormData(prev => ({ 
        ...prev, 
        documentUrl: url,
        documentName: fileName
      }));
    }
  };

  const handleCreateClub = async () => {
    try {
      if (isSubmitting) {
        return;
      }
      
      setIsSubmitting(true);
      
      // Validate the form data
      const validationResult = validateClubData(clubFormData);
      if (!validationResult.isValid) {
        toast({
          title: "Validation Error",
          description: validationResult.errorMessage || "Please check the form for errors.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create the club
      const success = await createClub(clubFormData, userId);
      
      if (success) {
        toast({
          title: "Club Created Successfully",
          description: "The club has been created successfully.",
        });
        
        // Reset form
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
        
        // Call success callback
        onSuccess();
      } else {
        toast({
          title: "Error Creating Club",
          description: "Failed to create the club. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleCreateClub:', error);
      toast({
        title: "Error Creating Club",
        description: "An error occurred while creating the club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clubFormData,
    setClubFormData,
    isSubmitting,
    isLoadingProfile,
    profileError,
    handleClubInputChange,
    handleCreateClub,
    handleFileUpload
  };
};
