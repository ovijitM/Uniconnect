
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from '../types';
import { parseArrayField, parseExecutiveMembers } from './dataTransformUtils';

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
      president_name: formData.presidentName || null,
      president_contact: formData.presidentContact || null,
      executive_members: parseExecutiveMembers(formData.executiveMembers),
      advisors: parseArrayField(formData.advisors),
      phone_number: formData.phoneNumber || null,
      website: formData.website || null,
      facebook_link: formData.facebookLink || null,
      instagram_link: formData.instagramLink || null,
      twitter_link: formData.twitterLink || null,
      discord_link: formData.discordLink || null,
      document_url: formData.documentUrl || null,
      document_name: formData.documentName || null
    };
    
    console.log('Prepared club data for insertion:', clubData);
    
    // Use the insert_club function to insert the club and make the user an admin
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
      console.error('Error inserting club through RPC:', error);
      throw error;
    }
    
    const clubId = data;
    console.log('Club created with ID:', clubId);
    
    // Update the club with the additional fields
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
        president_name: clubData.president_name,
        president_contact: clubData.president_contact,
        executive_members: clubData.executive_members,
        advisors: clubData.advisors,
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
      console.error('Error updating club with additional data:', updateError);
      throw updateError;
    }
    
    // Check if the club_admin entry was created by the RPC function
    const { data: adminCheck, error: adminCheckError } = await supabase
      .from('club_admins')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', userId);
    
    if (adminCheckError) {
      console.error('Error checking club admin status:', adminCheckError);
    } else {
      console.log('Club admin check result:', adminCheck);
      
      // If the club_admin entry doesn't exist, create it manually
      if (!adminCheck || adminCheck.length === 0) {
        console.log('Creating club admin relationship manually:', { club_id: clubId, user_id: userId });
        const { error: adminError } = await supabase
          .from('club_admins')
          .insert({ club_id: clubId, user_id: userId });
        
        if (adminError) {
          console.error('Error creating club admin relationship:', adminError);
          throw adminError;
        }
      }
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
