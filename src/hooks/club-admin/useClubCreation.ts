
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from './types';

export const useClubCreation = () => {
  const { toast } = useToast();

  const createClub = async (clubFormData: ClubFormData, userId: string | undefined): Promise<boolean> => {
    try {
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
      
      return true;
    } catch (error: any) {
      console.error('Error creating club:', error);
      toast({
        title: 'Error',
        description: `Failed to create club: ${error.message || 'Please try again.'}`,
        variant: 'destructive',
      });
      return false;
    }
  };

  return { createClub };
};
