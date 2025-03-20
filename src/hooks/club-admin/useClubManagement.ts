
import { useState } from 'react';
import { Club } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useClubManagement = (onRefresh: () => void) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openEditDialog = (club: Club) => {
    setSelectedClub(club);
    setEditFormData({
      name: club.name,
      description: club.description,
      category: club.category,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (club: Club) => {
    setSelectedClub(club);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClub = async () => {
    if (!selectedClub) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if all fields are filled
      if (!editFormData.name.trim() || !editFormData.description.trim() || !editFormData.category.trim()) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      // Update club in Supabase
      const { error } = await supabase
        .from('clubs')
        .update({
          name: editFormData.name,
          description: editFormData.description,
          category: editFormData.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedClub.id);
      
      if (error) throw error;
      
      toast({
        title: "Club updated",
        description: "The club has been updated successfully",
      });
      
      setIsEditDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error updating club:', error);
      toast({
        title: "Update failed",
        description: "Failed to update club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClub = async () => {
    if (!selectedClub) return;
    
    try {
      setIsSubmitting(true);
      
      // First, remove all club members
      const { error: memberError } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', selectedClub.id);
      
      if (memberError) throw memberError;
      
      // Next, remove club admins
      const { error: adminError } = await supabase
        .from('club_admins')
        .delete()
        .eq('club_id', selectedClub.id);
      
      if (adminError) throw adminError;

      // Finally, delete the club
      const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', selectedClub.id);
      
      if (error) throw error;
      
      toast({
        title: "Club deleted",
        description: "The club has been deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error deleting club:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedClub,
    editFormData,
    isSubmitting,
    openEditDialog,
    openDeleteDialog,
    handleEditClub,
    handleDeleteClub,
    handleInputChange
  };
};
