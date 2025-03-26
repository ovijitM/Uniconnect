import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useClubValidation } from './useClubValidation';

export const useClubCreation = () => {
  const { toast } = useToast();
  const { validateClubData } = useClubValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createClub = async (clubData: ClubFormData, userId: string | undefined, createClubAdmin = true) => {
    if (!userId) {
      console.error('No user ID provided');
      toast({
        title: 'Error',
        description: 'You must be logged in to create a club',
        variant: 'destructive',
      });
      return { success: false, error: 'No user ID provided' };
    }

    try {
      setIsSubmitting(true);
      
      // Validate club data
      const isValid = validateClubData(clubData);
      if (!isValid) {
        setIsSubmitting(false);
        return { success: false, error: 'Invalid club data' };
      }
      
      // Check if the user already has a club admin relationship for this university
      if (createClubAdmin) {
        console.log('Checking for existing club admin relationships for user', userId, 'at university', clubData.universityId);
        
        const { data: existingClubs, error: checkError } = await supabase
          .from('clubs')
          .select('id, name')
          .eq('university_id', clubData.universityId);
          
        if (checkError) {
          console.error('Error checking existing clubs:', checkError);
        } else if (existingClubs && existingClubs.length > 0) {
          console.log('Found existing clubs at this university:', existingClubs);
          
          // Check if the user is already an admin for any of these clubs
          const clubIds = existingClubs.map(club => club.id);
          
          const { data: existingAdminRoles, error: adminCheckError } = await supabase
            .from('club_admins')
            .select('club_id, user_id')
            .eq('user_id', userId)
            .in('club_id', clubIds);
            
          if (adminCheckError) {
            console.error('Error checking existing admin roles:', adminCheckError);
          } else if (existingAdminRoles && existingAdminRoles.length > 0) {
            console.log('User is already an admin for these clubs:', existingAdminRoles);
            // We don't need to block creation, but this is useful for debugging
          }
        }
      }
      
      // Create the club
      console.log('Creating club with data:', clubData);
      const { data, error } = await supabase
        .from('clubs')
        .insert({
          name: clubData.name,
          description: clubData.description,
          category: clubData.category,
          university: clubData.university,
          university_id: clubData.universityId,
          tagline: clubData.tagline || null,
          established_year: clubData.establishedYear ? parseInt(clubData.establishedYear) : null,
          affiliation: clubData.affiliation || null,
          why_join: clubData.whyJoin || null,
          regular_events: clubData.regularEvents ? clubData.regularEvents.split(',').map(event => event.trim()) : null,
          signature_events: clubData.signatureEvents ? clubData.signatureEvents.split(',').map(event => event.trim()) : null,
          community_engagement: clubData.communityEngagement || null,
          who_can_join: clubData.whoCanJoin || null,
          membership_fee: clubData.membershipFee || 'Free',
          how_to_join: clubData.howToJoin || null,
          president_name: clubData.presidentName || null,
          president_contact: clubData.presidentContact || null,
          executive_members: clubData.executiveMembers ? clubData.executiveMembers.split(',').map(member => member.trim()) : null,
          advisors: clubData.advisors ? clubData.advisors.split(',').map(advisor => advisor.trim()) : null,
          phone_number: clubData.phoneNumber || null,
          website: clubData.website || null,
          facebook_link: clubData.facebookLink || null,
          instagram_link: clubData.instagramLink || null,
          twitter_link: clubData.twitterLink || null,
          discord_link: clubData.discordLink || null,
          logo_url: clubData.logoUrl || null,
          document_url: clubData.documentUrl || null,
          document_name: clubData.documentName || null,
          status: 'pending'
        })
        .select();
      
      if (error) {
        console.error('Error creating club:', error);
        toast({
          title: 'Error',
          description: `Failed to create club: ${error.message}`,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return { success: false, error: error.message };
      }
      
      console.log('Club created successfully:', data);
      
      // If createClubAdmin is true, create a club admin relationship
      if (createClubAdmin && data && data.length > 0) {
        const clubId = data[0].id;
        
        // Check if the club_admin entry already exists
        const { data: existingAdmin, error: checkError } = await supabase
          .from('club_admins')
          .select('*')
          .eq('club_id', clubId)
          .eq('user_id', userId)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
          console.error('Error checking for existing admin relationship:', checkError);
        }
        
        // Only create the club_admin relationship if it doesn't already exist
        if (!existingAdmin) {
          console.log(`Creating club_admin relationship for user ${userId} and club ${clubId}`);
          
          const { error: adminError } = await supabase
            .from('club_admins')
            .insert({
              club_id: clubId,
              user_id: userId
            });
          
          if (adminError) {
            console.error('Error creating club admin relationship:', adminError);
            
            if (adminError.code === '23505') { // Duplicate key violation
              toast({
                title: 'Club Created',
                description: 'Club created successfully! You are already an admin for this club.',
                variant: 'default',
              });
              setIsSubmitting(false);
              return { success: true, clubId, warning: 'Admin relationship already exists' };
            } else {
              // Other errors
              toast({
                title: 'Partial Success',
                description: 'Club created but there was an issue assigning you as admin. Please contact support.',
                variant: 'default',
              });
              setIsSubmitting(false);
              return { success: true, clubId, warning: 'Admin relationship failed' };
            }
          }
        } else {
          console.log('Admin relationship already exists for this club and user');
        }
      }
      
      setIsSubmitting(false);
      return { success: true, clubId: data?.[0]?.id };
    } catch (error: any) {
      console.error('Error in club creation process:', error);
      toast({
        title: 'Error',
        description: `An unexpected error occurred: ${error.message || 'Please try again'}`,
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return { success: false, error: error.message };
    }
  };

  return {
    createClub,
    isSubmitting
  };
};
