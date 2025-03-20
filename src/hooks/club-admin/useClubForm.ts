
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubForm = (userId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: '',
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
    discordLink: ''
  });
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateClub = async () => {
    try {
      if (isSubmitting) return; // Prevent multiple submissions
      setIsSubmitting(true);

      if (!clubFormData.name || !clubFormData.description || !clubFormData.category) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Check if a club with this name already exists
      const { data: existingClubs, error: checkError } = await supabase
        .from('clubs')
        .select('id')
        .eq('name', clubFormData.name);
      
      if (checkError) {
        console.error('Error checking existing clubs:', checkError);
        throw new Error(checkError.message);
      }
      
      if (existingClubs && existingClubs.length > 0) {
        toast({
          title: 'Club Name Already Exists',
          description: 'Please choose a different club name.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Transform array and JSON fields
      const regularEvents = clubFormData.regularEvents ? clubFormData.regularEvents.split(',').map(e => e.trim()) : [];
      const signatureEvents = clubFormData.signatureEvents ? clubFormData.signatureEvents.split(',').map(e => e.trim()) : [];
      const advisors = clubFormData.advisors ? clubFormData.advisors.split(',').map(e => e.trim()) : [];
      const executiveMembers = clubFormData.executiveMembers ? JSON.parse(clubFormData.executiveMembers) : {};

      // Create the club with the new fields
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .insert({
          name: clubFormData.name,
          description: clubFormData.description,
          category: clubFormData.category,
          logo_url: null,
          status: 'pending',
          // New fields
          tagline: clubFormData.tagline || null,
          established_year: clubFormData.establishedYear ? parseInt(clubFormData.establishedYear) : null,
          affiliation: clubFormData.affiliation || null,
          why_join: clubFormData.whyJoin || null,
          regular_events: regularEvents,
          signature_events: signatureEvents,
          community_engagement: clubFormData.communityEngagement || null,
          who_can_join: clubFormData.whoCanJoin || null,
          membership_fee: clubFormData.membershipFee || 'Free',
          how_to_join: clubFormData.howToJoin || null,
          president_name: clubFormData.presidentName || null,
          president_contact: clubFormData.presidentContact || null,
          executive_members: executiveMembers,
          advisors: advisors,
          phone_number: clubFormData.phoneNumber || null,
          website: clubFormData.website || null,
          facebook_link: clubFormData.facebookLink || null,
          instagram_link: clubFormData.instagramLink || null,
          twitter_link: clubFormData.twitterLink || null,
          discord_link: clubFormData.discordLink || null
        })
        .select();
      
      if (clubError) {
        console.error('Error creating club:', clubError);
        throw clubError;
      }
      
      if (!clubData || clubData.length === 0) {
        throw new Error('No club data returned after creation');
      }

      // Add the current user as an admin of the club
      const { error: adminError } = await supabase
        .from('club_admins')
        .insert({
          club_id: clubData[0].id,
          user_id: userId,
        });
      
      if (adminError) {
        console.error('Error adding club admin:', adminError);
        // If we fail to add admin, we should delete the club to avoid orphaned clubs
        await supabase.from('clubs').delete().eq('id', clubData[0].id);
        throw adminError;
      }
      
      toast({
        title: 'Success',
        description: 'Club created successfully! It will be visible after admin approval.',
        variant: 'default',
      });
      
      // Reset form and close dialog
      setClubFormData({
        name: '',
        description: '',
        category: '',
        // Reset new fields
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
        discordLink: ''
      });
      setIsClubDialogOpen(false);
      
      // Refresh data
      onSuccess();
    } catch (error: any) {
      console.error('Error creating club:', error);
      toast({
        title: 'Error',
        description: `Failed to create club: ${error.message || 'Please try again.'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clubFormData,
    setClubFormData,
    isClubDialogOpen,
    setIsClubDialogOpen,
    isSubmitting,
    handleClubInputChange,
    handleCreateClub
  };
};
