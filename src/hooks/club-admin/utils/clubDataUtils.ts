
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
    // Prepare the data for insertion
    const clubData = {
      name: formData.name,
      description: formData.description,
      tagline: formData.tagline || null,
      category: formData.category,
      university: formData.university,
      university_id: universityId,
      logo_url: formData.logoUrl,
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
      website: formData.website || null,
      facebook_link: formData.facebookLink || null,
      instagram_link: formData.instagramLink || null,
      twitter_link: formData.twitterLink || null,
      discord_link: formData.discordLink || null,
      document_url: formData.documentUrl || null,
      document_name: formData.documentName || null
    };
    
    console.log('Prepared club data for insertion:', clubData);
    
    // Check if the user already has an admin relationship for a club in this university
    const { data: existingClubs, error: checkError } = await supabase
      .from('clubs')
      .select('id')
      .eq('university_id', universityId);
      
    if (checkError) {
      console.error('Error checking existing clubs:', checkError);
    } else if (existingClubs && existingClubs.length > 0) {
      console.log(`Found ${existingClubs.length} existing clubs at this university`);
      
      const clubIds = existingClubs.map(club => club.id);
      
      const { data: existingAdminRoles, error: adminCheckError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', userId)
        .in('club_id', clubIds);
        
      if (adminCheckError) {
        console.error('Error checking existing admin roles:', adminCheckError);
      } else if (existingAdminRoles && existingAdminRoles.length > 0) {
        console.log('User already has admin roles for clubs at this university:', existingAdminRoles);
      }
    }
    
    // Create the club
    const { data, error } = await supabase
      .from('clubs')
      .insert({
        name: clubData.name,
        description: clubData.description,
        category: clubData.category,
        university: clubData.university,
        university_id: clubData.university_id,
        logo_url: clubData.logo_url,
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
        document_name: clubData.document_name,
        status: 'pending'
      })
      .select();
      
    if (error) {
      console.error('Error inserting club:', error);
      throw error;
    }
    
    const clubId = data?.[0]?.id;
    console.log('Club created with ID:', clubId);
    
    if (!clubId) {
      throw new Error('Failed to get club ID after creation');
    }
    
    // Check if the club_admin entry already exists
    const { data: existingAdmin, error: checkAdminError } = await supabase
      .from('club_admins')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', userId)
      .single();
      
    if (checkAdminError && checkAdminError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking for existing admin relationship:', checkAdminError);
    }
    
    // Only create the club_admin relationship if it doesn't already exist
    if (!existingAdmin) {
      console.log('Creating club admin relationship for club ID:', clubId, 'and user ID:', userId);
      
      const { error: adminError } = await supabase
        .from('club_admins')
        .insert({ club_id: clubId, user_id: userId });
      
      if (adminError) {
        console.error('Error creating club admin relationship:', adminError);
        
        if (adminError.code === '23505') { // Duplicate key violation
          console.log('Admin relationship already exists (duplicate key error)');
        } else {
          throw adminError;
        }
      }
    } else {
      console.log('Admin relationship already exists, no need to create');
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
    
    console.log('Club creation and setup complete:', completeClub);
    return completeClub;
  } catch (error) {
    console.error('Error in insertClubData:', error);
    throw error;
  }
};
