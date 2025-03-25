
import { useState, useEffect } from 'react';
import { ClubFormData } from './types';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useClubFormState = () => {
  const { user } = useAuth();
  const { userUniversity, userUniversityId, fetchUserProfile } = useStudentProfile(user?.id);
  const { toast } = useToast();
  
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: '',
    university: '',
    universityId: '',
    // New fields with default values
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
    logoUrl: '', // Profile image link field
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
  }, [user?.id]);

  // Set the university from user profile when it's available
  useEffect(() => {
    if (userUniversity && userUniversityId && (!clubFormData.university || !clubFormData.universityId)) {
      setClubFormData(prev => ({
        ...prev,
        university: userUniversity,
        universityId: userUniversityId
      }));
      console.log('Set university from user profile:', userUniversity, 'with ID:', userUniversityId);
    } else if (isClubDialogOpen && (!userUniversity || !userUniversityId)) {
      // Alert the user if they don't have a university associated with their profile
      toast({
        title: "Missing University Affiliation",
        description: "You need to have a university in your profile to create a club. Please update your profile first.",
        variant: "warning",
      });
    }
  }, [userUniversity, userUniversityId, clubFormData.university, clubFormData.universityId, isClubDialogOpen]);

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClubFileUpload = (url: string, fileName: string, type: 'logo' | 'document' = 'document') => {
    if (type === 'logo') {
      console.log("Setting logo URL:", url);
      setClubFormData(prev => ({ ...prev, logoUrl: url }));
    } else {
      console.log("Setting document URL:", url, "Name:", fileName);
      setClubFormData(prev => ({ 
        ...prev, 
        documentUrl: url,
        documentName: fileName
      }));
    }
  };

  return {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    setIsSubmitting,
    handleClubInputChange,
    handleClubFileUpload
  };
};
