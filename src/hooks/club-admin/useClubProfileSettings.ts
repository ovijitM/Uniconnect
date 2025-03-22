
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Club } from '@/types';

export const useClubProfileSettings = (club: Club | null, onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: club?.name || '',
    description: club?.description || '',
    category: club?.category || '',
    tagline: club?.tagline || '',
    logoUrl: club?.logoUrl || '',
    establishedYear: club?.establishedYear ? String(club?.establishedYear) : '',
    affiliation: club?.affiliation || '',
    whyJoin: club?.whyJoin || '',
    regularEvents: club?.regularEvents ? club.regularEvents.join(', ') : '',
    signatureEvents: club?.signatureEvents ? club.signatureEvents.join(', ') : '',
    communityEngagement: club?.communityEngagement || '',
    whoCanJoin: club?.whoCanJoin || '',
    membershipFee: club?.membershipFee || 'Free',
    howToJoin: club?.howToJoin || '',
    presidentName: club?.presidentName || '',
    presidentContact: club?.presidentContact || '',
    executiveMembers: club?.executiveMembers ? JSON.stringify(club.executiveMembers) : '',
    advisors: club?.advisors ? club.advisors.join(', ') : '',
    phoneNumber: club?.phoneNumber || '',
    website: club?.website || '',
    facebookLink: club?.facebookLink || '',
    instagramLink: club?.instagramLink || '',
    twitterLink: club?.twitterLink || '',
    discordLink: club?.discordLink || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const updateClubProfile = async () => {
    if (!club) return;
    
    try {
      setIsSubmitting(true);
      
      // Transform array and JSON fields
      const regularEvents = profileData.regularEvents ? profileData.regularEvents.split(',').map(e => e.trim()) : [];
      const signatureEvents = profileData.signatureEvents ? profileData.signatureEvents.split(',').map(e => e.trim()) : [];
      const advisors = profileData.advisors ? profileData.advisors.split(',').map(e => e.trim()) : [];
      
      // Handle executive members - ensure it's valid JSON
      let executiveMembers = {};
      if (profileData.executiveMembers) {
        try {
          executiveMembers = JSON.parse(profileData.executiveMembers);
        } catch (error) {
          console.error('Error parsing executive members:', error);
          executiveMembers = {};
        }
      }

      // Update club in Supabase
      const { error } = await supabase
        .from('clubs')
        .update({
          name: profileData.name,
          description: profileData.description,
          category: profileData.category,
          logo_url: profileData.logoUrl,
          tagline: profileData.tagline || null,
          established_year: profileData.establishedYear ? parseInt(profileData.establishedYear) : null,
          affiliation: profileData.affiliation || null,
          why_join: profileData.whyJoin || null,
          regular_events: regularEvents,
          signature_events: signatureEvents,
          community_engagement: profileData.communityEngagement || null,
          who_can_join: profileData.whoCanJoin || null,
          membership_fee: profileData.membershipFee || 'Free',
          how_to_join: profileData.howToJoin || null,
          president_name: profileData.presidentName || null,
          president_contact: profileData.presidentContact || null,
          executive_members: executiveMembers,
          advisors: advisors,
          phone_number: profileData.phoneNumber || null,
          website: profileData.website || null,
          facebook_link: profileData.facebookLink || null,
          instagram_link: profileData.instagramLink || null,
          twitter_link: profileData.twitterLink || null,
          discord_link: profileData.discordLink || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', club.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your club profile has been updated successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error updating club profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update club profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    profileData,
    setProfileData,
    handleInputChange,
    updateClubProfile,
    isSubmitting
  };
};
