
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClubFormData } from './types';

export const useClubForm = (userId: string | undefined, onSuccess: () => void) => {
  const { toast } = useToast();
  const [clubFormData, setClubFormData] = useState<ClubFormData>({
    name: '',
    description: '',
    category: ''
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

      // First, create the club
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .insert({
          name: clubFormData.name,
          description: clubFormData.description,
          category: clubFormData.category,
          logo_url: null,
        })
        .select();
      
      if (clubError) {
        console.error('Error creating club:', clubError);
        throw clubError;
      }
      
      if (!clubData || clubData.length === 0) {
        throw new Error('No club data returned after creation');
      }

      // Then, add the current user as an admin of the club
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
        description: 'Club created successfully!',
        variant: 'default',
      });
      
      // Reset form and close dialog
      setClubFormData({
        name: '',
        description: '',
        category: ''
      });
      setIsClubDialogOpen(false);
      
      // Refresh data
      onSuccess();
    } catch (error: any) {
      console.error('Error creating club:', error);
      toast({
        title: 'Error',
        description: 'Failed to create club. Please try again.',
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
