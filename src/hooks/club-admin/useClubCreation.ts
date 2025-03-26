
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useClubValidation } from './useClubValidation';
import { addClubAdmin } from './utils/clubAdminUtils';

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
      const validation = validateClubData(clubData);
      if (!validation.isValid) {
        toast({
          title: 'Validation Error',
          description: validation.errorMessage || 'Please check your form data and try again.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return { success: false, error: validation.errorMessage || 'Invalid club data' };
      }
      
      // Check if the user already has a club admin relationship
      if (createClubAdmin) {
        console.log('Checking if user already has a club');
        
        try {
          const { data: existingAdminRoles, error: adminCheckError } = await supabase
            .from('club_admins')
            .select('club_id')
            .eq('user_id', userId);
            
          if (adminCheckError) {
            console.error('Error checking existing admin roles:', adminCheckError);
            toast({
              title: 'Error',
              description: 'Failed to check if you already have a club',
              variant: 'destructive',
            });
            setIsSubmitting(false);
            return { success: false, error: adminCheckError.message };
          }
          
          if (existingAdminRoles && existingAdminRoles.length > 0) {
            console.log('User already has a club admin role:', existingAdminRoles);
            toast({
              title: 'Club Limit Reached',
              description: 'You can only be an admin for one club. Please manage your existing club.',
              variant: 'destructive',
            });
            setIsSubmitting(false);
            return { success: false, error: 'User already has a club' };
          }
        } catch (checkError) {
          console.error('Error checking club admin status:', checkError);
          // Continue with club creation even if check fails
          // This allows offline club creation to be attempted
        }
      }
      
      // Create the club
      console.log('Creating club with data:', clubData);
      
      // Transform any arrays or complex data
      const regularEvents = clubData.regularEvents 
        ? typeof clubData.regularEvents === 'string' 
          ? clubData.regularEvents.split(',').map(event => event.trim()) 
          : clubData.regularEvents
        : null;
      
      const signatureEvents = clubData.signatureEvents 
        ? typeof clubData.signatureEvents === 'string' 
          ? clubData.signatureEvents.split(',').map(event => event.trim()) 
          : clubData.signatureEvents
        : null;
      
      const executiveMembers = clubData.executiveMembers 
        ? typeof clubData.executiveMembers === 'string' 
          ? clubData.executiveMembers.split(',').map(member => member.trim()) 
          : clubData.executiveMembers
        : null;
      
      const advisors = clubData.advisors 
        ? typeof clubData.advisors === 'string' 
          ? clubData.advisors.split(',').map(advisor => advisor.trim()) 
          : clubData.advisors
        : null;
      
      try {
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
            regular_events: regularEvents,
            signature_events: signatureEvents,
            community_engagement: clubData.communityEngagement || null,
            who_can_join: clubData.whoCanJoin || null,
            membership_fee: clubData.membershipFee || 'Free',
            how_to_join: clubData.howToJoin || null,
            president_name: clubData.presidentName || null,
            president_contact: clubData.presidentContact || null,
            executive_members: executiveMembers,
            advisors: advisors,
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
          
          try {
            await addClubAdmin(clubId, userId);
            toast({
              title: 'Success',
              description: 'Club created successfully and you have been added as an admin!',
              variant: 'default',
            });
          } catch (adminError: any) {
            console.error('Error adding club admin:', adminError);
            toast({
              title: 'Partial Success',
              description: 'Club created but there was an issue assigning you as admin. Please contact support.',
              variant: 'default',
            });
            setIsSubmitting(false);
            return { success: true, clubId, warning: 'Admin relationship failed' };
          }
        }
        
        setIsSubmitting(false);
        return { success: true, clubId: data?.[0]?.id };
      } catch (insertError: any) {
        console.error('Error inserting club data:', insertError);
        toast({
          title: 'Database Error',
          description: `Failed to save club: ${insertError.message || 'Unknown database error'}`,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return { success: false, error: insertError.message };
      }
      
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
