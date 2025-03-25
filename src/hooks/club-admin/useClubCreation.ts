
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from './types';

export const useClubCreation = () => {
  const { toast } = useToast();

  const createClub = async (clubFormData: ClubFormData, userId: string | undefined): Promise<boolean> => {
    try {
      if (!userId) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to create a club.',
          variant: 'destructive',
        });
        return false;
      }

      // Check if university is provided
      if (!clubFormData.university) {
        toast({
          title: 'Missing University',
          description: 'A university affiliation is required to create a club.',
          variant: 'destructive',
        });
        return false;
      }

      // Check for university ID
      let universityId = clubFormData.universityId;
      if (!universityId) {
        // Try to find the university
        const { data: uniData, error: uniError } = await supabase
          .from('universities')
          .select('id')
          .eq('name', clubFormData.university)
          .maybeSingle();
          
        if (uniError) {
          console.error('Error finding university:', uniError);
        } else if (uniData) {
          universityId = uniData.id;
        } else {
          // Create the university if it doesn't exist
          const { data: newUni, error: createError } = await supabase
            .from('universities')
            .insert({ name: clubFormData.university })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating university:', createError);
          } else if (newUni) {
            universityId = newUni.id;
          }
        }
      }

      console.log('Creating club with data:', clubFormData);
      console.log('User ID:', userId);
      console.log('University ID:', universityId);

      // Transform array and JSON fields
      const regularEvents = clubFormData.regularEvents ? clubFormData.regularEvents.split(',').map(e => e.trim()) : [];
      const signatureEvents = clubFormData.signatureEvents ? clubFormData.signatureEvents.split(',').map(e => e.trim()) : [];
      const advisors = clubFormData.advisors ? clubFormData.advisors.split(',').map(e => e.trim()) : [];
      
      // Handle executive members - ensure it's valid JSON
      let executiveMembers = {};
      if (clubFormData.executiveMembers) {
        try {
          executiveMembers = JSON.parse(clubFormData.executiveMembers);
        } catch (error) {
          console.error('Error parsing executive members:', error);
          // If parsing fails, store as is
          executiveMembers = {};
        }
      }

      // Create the club
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .insert({
          name: clubFormData.name,
          description: clubFormData.description,
          category: clubFormData.category,
          logo_url: clubFormData.logoUrl,
          status: 'pending',
          university: clubFormData.university,
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
          discord_link: clubFormData.discordLink || null,
          document_url: clubFormData.documentUrl || null,
          document_name: clubFormData.documentName || null
        })
        .select();
      
      if (clubError) {
        console.error('Error creating club:', clubError);
        toast({
          title: 'Error Creating Club',
          description: `Failed to create club: ${clubError.message || 'Please try again.'}`,
          variant: 'destructive',
        });
        return false;
      }
      
      if (!clubData || clubData.length === 0) {
        console.error('No club data returned after creation');
        toast({
          title: 'Error',
          description: 'No club data returned after creation. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      console.log('Club created successfully:', clubData);

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
        toast({
          title: 'Error',
          description: `Failed to add you as admin: ${adminError.message || 'Please try again.'}`,
          variant: 'destructive',
        });
        return false;
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
