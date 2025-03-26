
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from './types';
import { findOrCreateUniversity } from './utils/universityUtils';
import { insertClubData } from './utils/clubDataUtils';

export const useClubCreation = () => {
  const { toast } = useToast();

  const createClub = async (clubFormData: ClubFormData, userId: string | undefined): Promise<boolean> => {
    try {
      console.log("Starting createClub function with user ID:", userId);
      
      if (!userId) {
        console.error("No user ID provided");
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to create a club.',
          variant: 'destructive',
        });
        return false;
      }

      // Check if university is provided
      if (!clubFormData.university) {
        console.error("No university provided");
        toast({
          title: 'Missing University',
          description: 'A university affiliation is required to create a club.',
          variant: 'destructive',
        });
        return false;
      }

      // Check if logo is uploaded
      if (!clubFormData.logoUrl) {
        console.error("No logo URL provided");
        toast({
          title: 'Missing Logo',
          description: 'Please upload a logo for your club.',
          variant: 'destructive',
        });
        return false;
      }

      // Find or create university
      let universityId;
      try {
        // Use the provided universityId if available, otherwise find or create
        universityId = clubFormData.universityId || await findOrCreateUniversity(clubFormData.university);
        console.log("Creating club with university:", clubFormData.university, "and universityId:", universityId);
      } catch (error: any) {
        console.error("Error processing university:", error);
        toast({
          title: 'Database Error',
          description: error.message || 'Failed to process university information. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      // Insert club data - now passing the userId to use with the security definer function
      let clubData;
      try {
        clubData = await insertClubData(clubFormData, universityId, userId);
        console.log('Club created successfully:', clubData);
      } catch (error: any) {
        console.error('Error creating club:', error);
        
        // Provide more detailed error message for better debugging
        if (error.message.includes('JSON object requested, multiple (or no) rows returned')) {
          toast({
            title: 'Error Creating Club',
            description: 'Database error: Could not create club due to an issue with the returned data. Please try again later.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error Creating Club',
            description: error.message || 'Failed to create club. Please try again.',
            variant: 'destructive',
          });
        }
        return false;
      }

      // Add the current user as an admin of the club
      try {
        // Check if we need to manually add the user as club admin
        // The RPC function already does this, so only do it for direct inserts
        if (!clubData.created_with_rpc) {
          console.log("Adding user as club admin:", userId, "for club:", clubData.id);
          const { error } = await supabase
            .from('club_admins')
            .insert({
              club_id: clubData.id,
              user_id: userId
            });
            
          if (error) {
            console.error("Error adding club admin:", error);
            throw error;
          }
        }
      } catch (error: any) {
        console.error('Error adding club admin:', error);
        // If we fail to add admin, we should delete the club to avoid orphaned clubs
        await supabase.from('clubs').delete().eq('id', clubData.id);
        toast({
          title: 'Error',
          description: error.message || 'Failed to add you as admin. Please try again.',
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
