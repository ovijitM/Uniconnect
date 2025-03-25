
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from './types';
import { useAuth } from '@/contexts/AuthContext';

export const useClubCreation = (userId: string | undefined, onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createClub = async (formData: ClubFormData, setFormData: React.Dispatch<React.SetStateAction<ClubFormData>>, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a club.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, get the user's university from their profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('university, university_id')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Could not retrieve your university information');
      }
      
      if (!profileData.university) {
        throw new Error('Your profile is missing university information');
      }

      // Insert the club with the university information from the profile
      const { data, error } = await supabase
        .from('clubs')
        .insert({
          name: formData.name,
          description: formData.description,
          logo_url: formData.logoUrl,
          category: formData.category,
          tagline: formData.tagline,
          university: profileData.university,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating club:', error);
        throw error;
      }

      // Add the creator as club admin
      const { error: adminError } = await supabase
        .from('club_admins')
        .insert({
          user_id: userId,
          club_id: data.id,
        });

      if (adminError) {
        console.error('Error setting user as club admin:', adminError);
        // Continue even if this fails, it's better to have the club without admin than no club at all
      }

      toast({
        title: 'Success',
        description: 'Club created successfully! It is now pending approval.',
      });

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        logoUrl: '',
        category: '',
        tagline: '',
      });
      
      setIsOpen(false);
      
      // Call the success callback to refresh the clubs list
      onSuccess();
    } catch (error) {
      console.error('Error in club creation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create club. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createClub,
    isSubmitting,
  };
};
