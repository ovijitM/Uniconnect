
import { useState } from 'react';
import { ClubFormData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { addClubAdmin } from './utils/clubAdminUtils';
import { useToast } from '@/hooks/use-toast';

export const useClubCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createClub = async (formData: ClubFormData, userId?: string): Promise<boolean> => {
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "User ID is required to create a club.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsLoading(true);
      console.log('Creating club with data:', formData);

      // Convert established year to number if it exists
      const establishedYear = formData.establishedYear 
        ? parseInt(formData.establishedYear) 
        : null;

      // Convert string arrays to actual arrays if they are strings
      const processStringArray = (value: string | string[] | null): string[] | null => {
        if (!value) return null;
        if (typeof value === 'string') {
          return value.split(',').map(item => item.trim()).filter(Boolean);
        }
        return value;
      };

      const regularEvents = processStringArray(formData.regularEvents);
      const signatureEvents = processStringArray(formData.signatureEvents);
      const advisors = processStringArray(formData.advisors);

      // Create the club in the database
      const { data: club, error } = await supabase
        .from('clubs')
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          university: formData.university,
          university_id: formData.universityId,
          logo_url: formData.logoUrl,
          tagline: formData.tagline,
          established_year: establishedYear,
          affiliation: formData.affiliation,
          why_join: formData.whyJoin,
          regular_events: regularEvents,
          signature_events: signatureEvents,
          community_engagement: formData.communityEngagement,
          who_can_join: formData.whoCanJoin,
          membership_fee: formData.membershipFee,
          how_to_join: formData.howToJoin,
          president_name: formData.presidentName,
          president_contact: formData.presidentContact,
          executive_members: formData.executiveMembers ? JSON.parse(formData.executiveMembers) : null,
          advisors: advisors,
          phone_number: formData.phoneNumber,
          website: formData.website,
          facebook_link: formData.facebookLink,
          instagram_link: formData.instagramLink,
          twitter_link: formData.twitterLink,
          discord_link: formData.discordLink,
          document_url: formData.documentUrl,
          document_name: formData.documentName,
          status: 'pending' // Set status to pending for admin approval
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating club:', error);
        throw error;
      }

      console.log('Club created successfully with ID:', club.id);

      // Add the user as an admin for this club
      await addClubAdmin(club.id, userId);

      toast({
        title: "Success",
        description: "Club created successfully and pending approval.",
      });

      return true;
    } catch (error: any) {
      console.error('Error in createClub:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create club",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createClub, isLoading };
};
