
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from '../types';
import { parseArrayField, parseExecutiveMembersRoles } from './dataTransformUtils';

export const insertClubData = async (
  formData: ClubFormData,
  universityId: string,
  userId: string
) => {
  console.log('Starting club insertion with data:', { 
    name: formData.name, 
    university: formData.university,
    universityId,
    userId 
  });
  
  try {
    // First check if user is already an admin for a club in this university
    const checkUserClubs = async () => {
      const { data: existingClubs, error: checkError } = await supabase
        .from('clubs')
        .select('id')
        .eq('university_id', universityId);
        
      if (checkError) {
        console.error('Error checking existing clubs:', checkError);
        return [];
      }
      
      if (!existingClubs || existingClubs.length === 0) {
        return [];
      }
      
      const clubIds = existingClubs.map(club => club.id);
      
      const { data: existingAdminRoles, error: adminCheckError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId)
        .in('club_id', clubIds);
        
      if (adminCheckError) {
        console.error('Error checking existing admin roles:', adminCheckError);
        return [];
      }
      
      return existingAdminRoles || [];
    };
    
    const existingUserRoles = await checkUserClubs();
    console.log('User existing admin roles:', existingUserRoles);
    
    // Prepare the club data
    const prepareClubData = () => {
      return {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        university: formData.university,
        university_id: universityId,
        logo_url: formData.logoUrl,
        tagline: formData.tagline || null,
        established_year: formData.establishedYear ? parseInt(formData.establishedYear) : null,
        affiliation: formData.affiliation || null,
        why_join: formData.whyJoin || null,
        regular_events: parseArrayField(formData.regularEvents),
        signature_events: parseArrayField(formData.signatureEvents),
        community_engagement: formData.communityEngagement || null,
        who_can_join: formData.whoCanJoin || null,
        membership_fee: formData.membershipFee || 'Free',
        how_to_join: formData.howToJoin || null,
        president_chair_name: formData.presidentChairName || formData.presidentName || null,
        president_chair_contact: formData.presidentChairContact || formData.presidentContact || null,
        executive_members: {},
        executive_members_roles: parseExecutiveMembersRoles(formData.executiveMembersRoles),
        faculty_advisors: parseArrayField(formData.facultyAdvisors || formData.advisors),
        primary_faculty_advisor: formData.primaryFacultyAdvisor || formData.facultyAdvisor || null,
        phone_number: formData.phoneNumber || formData.contactPhone || null,
        website: formData.website || formData.socialMediaLinks?.website || null,
        facebook_link: formData.facebookLink || formData.socialMediaLinks?.facebook || null,
        instagram_link: formData.instagramLink || formData.socialMediaLinks?.instagram || null,
        twitter_link: formData.twitterLink || formData.socialMediaLinks?.twitter || null,
        discord_link: formData.discordLink || formData.socialMediaLinks?.discord || null,
        document_url: formData.documentUrl || null,
        document_name: formData.documentName || null,
        status: 'pending'
      };
    };
    
    // Create the club with transaction-like pattern
    const clubData = prepareClubData();
    console.log('Prepared club data for insertion');
    
    // Step 1: Use the insert_club RPC function which handles both club creation and admin assignment
    const { data, error } = await supabase.rpc('insert_club', {
      name: clubData.name,
      description: clubData.description,
      category: clubData.category,
      university: clubData.university,
      university_id: clubData.university_id,
      logo_url: clubData.logo_url,
      club_admin_id: userId
    });
    
    if (error) {
      console.error('Error inserting club:', error);
      throw error;
    }
    
    const clubId = data;
    console.log('Club created with ID:', clubId);
    
    if (!clubId) {
      throw new Error('Failed to get club ID after creation');
    }
    
    // Step 2: Update the club with the remaining details
    const { error: updateError } = await supabase
      .from('clubs')
      .update({
        tagline: clubData.tagline,
        established_year: clubData.established_year,
        affiliation: clubData.affiliation,
        why_join: clubData.why_join,
        regular_events: clubData.regular_events,
        signature_events: clubData.signature_events,
        community_engagement: clubData.community_engagement,
        who_can_join: clubData.who_can_join,
        membership_fee: clubData.membership_fee,
        how_to_join: clubData.how_to_join,
        president_chair_name: clubData.president_chair_name,
        president_chair_contact: clubData.president_chair_contact,
        executive_members: clubData.executive_members,
        executive_members_roles: clubData.executive_members_roles,
        faculty_advisors: clubData.faculty_advisors,
        primary_faculty_advisor: clubData.primary_faculty_advisor,
        phone_number: clubData.phone_number,
        website: clubData.website,
        facebook_link: clubData.facebook_link,
        instagram_link: clubData.instagram_link,
        twitter_link: clubData.twitter_link,
        discord_link: clubData.discord_link,
        document_url: clubData.document_url,
        document_name: clubData.document_name
      })
      .eq('id', clubId);
    
    if (updateError) {
      console.error('Error updating club details:', updateError);
      throw updateError;
    }
    
    // Get the complete club data to return
    const { data: completeClub, error: fetchError } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching complete club data:', fetchError);
      throw fetchError;
    }
    
    console.log('Club creation and setup complete');
    return completeClub;
  } catch (error) {
    console.error('Error in insertClubData:', error);
    throw error;
  }
};

// Optimized function to update an existing club
export const updateClubData = async (
  clubId: string,
  formData: ClubFormData,
  userId: string
) => {
  console.log('Updating club with ID:', clubId);
  
  try {
    // Verify user has permission to edit this club
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('club_admins')
      .select('club_id')
      .eq('club_id', clubId)
      .eq('user_id', userId)
      .single();
    
    if (adminCheckError || !adminCheck) {
      throw new Error('You do not have permission to edit this club');
    }
    
    // Prepare update data similar to the insert function
    const clubData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      logo_url: formData.logoUrl || null,
      tagline: formData.tagline || null,
      established_year: formData.establishedYear ? parseInt(formData.establishedYear) : null,
      affiliation: formData.affiliation || null,
      why_join: formData.whyJoin || null,
      regular_events: parseArrayField(formData.regularEvents),
      signature_events: parseArrayField(formData.signatureEvents),
      community_engagement: formData.communityEngagement || null,
      who_can_join: formData.whoCanJoin || null,
      membership_fee: formData.membershipFee || 'Free',
      how_to_join: formData.howToJoin || null,
      president_chair_name: formData.presidentChairName || null,
      president_chair_contact: formData.presidentChairContact || null,
      executive_members_roles: parseExecutiveMembersRoles(formData.executiveMembersRoles),
      faculty_advisors: parseArrayField(formData.facultyAdvisors),
      primary_faculty_advisor: formData.primaryFacultyAdvisor || null,
      phone_number: formData.phoneNumber || null,
      website: formData.website || formData.socialMediaLinks?.website || null,
      facebook_link: formData.facebookLink || formData.socialMediaLinks?.facebook || null,
      instagram_link: formData.instagramLink || formData.socialMediaLinks?.instagram || null,
      twitter_link: formData.twitterLink || formData.socialMediaLinks?.twitter || null,
      discord_link: formData.discordLink || formData.socialMediaLinks?.discord || null,
      document_url: formData.documentUrl || null,
      document_name: formData.documentName || null,
    };
    
    const { error: updateError } = await supabase
      .from('clubs')
      .update(clubData)
      .eq('id', clubId);
    
    if (updateError) {
      throw updateError;
    }
    
    // Get the updated club data
    const { data: updatedClub, error: fetchError } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single();
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log('Club updated successfully');
    return updatedClub;
  } catch (error) {
    console.error('Error in updateClubData:', error);
    throw error;
  }
};
