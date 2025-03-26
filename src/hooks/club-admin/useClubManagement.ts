import { useState } from 'react';
import { Club } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { parseExecutiveMembersRoles } from './utils/dataTransformUtils';

export const useClubManagement = (onRefresh: () => void) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    category: '',
    // Added all fields to match the club creation form
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
    discordLink: '',
    university: '',
    universityId: '',
    
    // Add new leadership fields
    presidentChairName: '',
    presidentChairContact: '',
    executiveMembersRoles: '',
    facultyAdvisors: '',
    primaryFacultyAdvisor: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openEditDialog = (club: Club) => {
    setSelectedClub(club);
    setEditFormData({
      name: club.name,
      description: club.description,
      category: club.category,
      // Add all the additional fields with fallbacks
      tagline: club.tagline || '',
      establishedYear: club.establishedYear ? String(club.establishedYear) : '',
      affiliation: club.affiliation || '',
      whyJoin: club.whyJoin || '',
      regularEvents: club.regularEvents ? club.regularEvents.join(', ') : '',
      signatureEvents: club.signatureEvents ? club.signatureEvents.join(', ') : '',
      communityEngagement: club.communityEngagement || '',
      whoCanJoin: club.whoCanJoin || '',
      membershipFee: club.membershipFee || 'Free',
      howToJoin: club.howToJoin || '',
      presidentName: club.presidentName || '',
      presidentContact: club.presidentContact || '',
      executiveMembers: club.executiveMembers ? JSON.stringify(club.executiveMembers) : '',
      advisors: club.advisors ? club.advisors.join(', ') : '',
      phoneNumber: club.phoneNumber || '',
      website: club.website || '',
      facebookLink: club.facebookLink || '',
      instagramLink: club.instagramLink || '',
      twitterLink: club.twitterLink || '',
      discordLink: club.discordLink || '',
      university: club.university || '',
      universityId: club.universityId || '',
      
      // Map new leadership fields
      presidentChairName: club.presidentChairName || '',
      presidentChairContact: club.presidentChairContact || '',
      executiveMembersRoles: club.executiveMembersRoles ? JSON.stringify(club.executiveMembersRoles) : '',
      facultyAdvisors: club.facultyAdvisors ? club.facultyAdvisors.join(', ') : '',
      primaryFacultyAdvisor: club.primaryFacultyAdvisor || '',
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
      
      // Check if required fields are filled
      if (!editFormData.name.trim() || !editFormData.description.trim() || !editFormData.category.trim()) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Handle university relationship
      let universityId = editFormData.universityId;
      
      if (editFormData.university && !universityId) {
        // Try to find the university
        const { data: uniData, error: uniError } = await supabase
          .from('universities')
          .select('id')
          .eq('name', editFormData.university)
          .maybeSingle();
          
        if (uniError) {
          console.error('Error finding university:', uniError);
        } else if (uniData) {
          universityId = uniData.id;
        } else {
          // Create the university if it doesn't exist
          const { data: newUni, error: createError } = await supabase
            .from('universities')
            .insert({ name: editFormData.university })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating university:', createError);
          } else if (newUni) {
            universityId = newUni.id;
          }
        }
      }
      
      // Transform array and JSON fields
      const regularEvents = editFormData.regularEvents ? editFormData.regularEvents.split(',').map(e => e.trim()) : [];
      const signatureEvents = editFormData.signatureEvents ? editFormData.signatureEvents.split(',').map(e => e.trim()) : [];
      const advisors = editFormData.advisors ? editFormData.advisors.split(',').map(e => e.trim()) : [];
      
      // Transform array and JSON fields
      const facultyAdvisors = editFormData.facultyAdvisors ? 
        editFormData.facultyAdvisors.split(',').map(e => e.trim()) : [];
      
      // Handle executive members roles - ensure it's valid JSON
      let executiveMembersRoles = {};
      if (editFormData.executiveMembersRoles) {
        try {
          executiveMembersRoles = parseExecutiveMembersRoles(editFormData.executiveMembersRoles) || {};
        } catch (error) {
          console.error('Error parsing executive members roles:', error);
          // If parsing fails, store as empty object
          executiveMembersRoles = {};
        }
      }

      // Update club in Supabase
      const { error } = await supabase
        .from('clubs')
        .update({
          name: editFormData.name,
          description: editFormData.description,
          category: editFormData.category,
          tagline: editFormData.tagline || null,
          established_year: editFormData.establishedYear ? parseInt(editFormData.establishedYear) : null,
          affiliation: editFormData.affiliation || null,
          why_join: editFormData.whyJoin || null,
          regular_events: regularEvents,
          signature_events: signatureEvents,
          community_engagement: editFormData.communityEngagement || null,
          who_can_join: editFormData.whoCanJoin || null,
          membership_fee: editFormData.membershipFee || 'Free',
          how_to_join: editFormData.howToJoin || null,
          president_name: editFormData.presidentName || null,
          president_contact: editFormData.presidentContact || null,
          executive_members: executiveMembers,
          advisors: advisors,
          phone_number: editFormData.phoneNumber || null,
          website: editFormData.website || null,
          facebook_link: editFormData.facebookLink || null,
          instagram_link: editFormData.instagramLink || null,
          twitter_link: editFormData.twitterLink || null,
          discord_link: editFormData.discordLink || null,
          university: editFormData.university || null,
          university_id: universityId || null,
          updated_at: new Date().toISOString(),
          
          // Add new leadership fields
          president_chair_name: editFormData.presidentChairName || null,
          president_chair_contact: editFormData.presidentChairContact || null,
          executive_members_roles: executiveMembersRoles,
          faculty_advisors: facultyAdvisors,
          primary_faculty_advisor: editFormData.primaryFacultyAdvisor || null,
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
