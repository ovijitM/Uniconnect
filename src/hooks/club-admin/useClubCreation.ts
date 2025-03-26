
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
      console.log("Full form data being processed:", clubFormData);
      
      if (!userId) {
        console.error("No user ID provided");
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to create a club.',
          variant: 'destructive',
        });
        return false;
      }

      // Check if required fields are provided
      if (!clubFormData.name || !clubFormData.description || !clubFormData.category) {
        console.error("Missing required basic fields");
        toast({
          title: 'Missing Required Fields',
          description: 'Please fill in all required fields (name, description, category).',
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

      // Insert club data with explicit error handling
      try {
        const clubData = await insertClubData(clubFormData, universityId, userId);
        
        if (!clubData || !clubData.id) {
          console.error('Error: No club data returned after insertion');
          toast({
            title: 'Error Creating Club',
            description: 'No club data was returned after creation. Please try again.',
            variant: 'destructive',
          });
          return false;
        }
        
        console.log('Club created successfully:', clubData);
        
        toast({
          title: 'Success',
          description: 'Club created successfully! It will be visible after admin approval.',
          variant: 'default',
        });
        
        return true;
      } catch (error: any) {
        console.error('Error creating club:', error);
        
        // Provide more detailed error message for better debugging
        toast({
          title: 'Error Creating Club',
          description: error.message || 'Failed to create club. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
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
