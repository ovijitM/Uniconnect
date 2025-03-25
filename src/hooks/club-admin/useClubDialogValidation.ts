
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubDialogValidation = () => {
  const { toast } = useToast();

  const validateBasicInfo = (formData: ClubFormData): boolean => {
    if (!formData.name?.trim()) {
      toast({ title: "Missing Club Name", description: "Please provide a name for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.description?.trim()) {
      toast({ title: "Missing Description", description: "Please provide a description for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.category?.trim()) {
      toast({ title: "Missing Category", description: "Please select a category for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.tagline?.trim()) {
      toast({ title: "Missing Tagline", description: "Please provide a tagline for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.establishedYear?.trim()) {
      toast({ title: "Missing Established Year", description: "Please provide the year your club was established.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateDetails = (formData: ClubFormData): boolean => {
    if (!formData.whyJoin?.trim()) {
      toast({ title: "Missing Why Join", description: "Please explain why students should join your club.", variant: "destructive" });
      return false;
    }
    if (!formData.presidentName?.trim()) {
      toast({ title: "Missing President Name", description: "Please provide the club president's name.", variant: "destructive" });
      return false;
    }
    if (!formData.presidentContact?.trim()) {
      toast({ title: "Missing President Contact", description: "Please provide the club president's contact information.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateSocialMedia = (formData: ClubFormData): boolean => {
    if (!formData.phoneNumber?.trim()) {
      toast({ title: "Missing Phone Number", description: "Please provide a contact phone number for your club.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateDocuments = (formData: ClubFormData): boolean => {
    if (!formData.logoUrl) {
      toast({ title: "Missing Logo", description: "Please upload a logo for your club.", variant: "destructive" });
      return false;
    }
    return true;
  };

  return {
    validateBasicInfo,
    validateDetails,
    validateSocialMedia,
    validateDocuments
  };
};
