
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from '../types';
import { parseArrayField, parseExecutiveMembers, logFormData } from './dataTransformUtils';

export const insertClubData = async (
  clubFormData: ClubFormData, 
  universityId: string,
  userId?: string
) => {
  // Log the complete form data being processed
  logFormData(clubFormData, "Club Form Data");
  
  console.log("Inserting club data:", {
    name: clubFormData.name,
    description: clubFormData.description,
    university: clubFormData.university,
    universityId: universityId,
    userId: userId
  });

  // Transform array and JSON fields
  const regularEvents = parseArrayField(clubFormData.regularEvents);
  const signatureEvents = parseArrayField(clubFormData.signatureEvents);
  const advisors = parseArrayField(clubFormData.advisors);
  const executiveMembers = parseExecutiveMembers(clubFormData.executiveMembers);

  try {
    // First, try to use the security definer function
    if (userId) {
      console.log("Using security definer function to create club with userId:", userId);
      const { data: clubId, error: insertError } = await supabase.rpc('insert_club', {
        name: clubFormData.name,
        description: clubFormData.description,
        category: clubFormData.category,
        university: clubFormData.university,
        university_id: universityId,
        logo_url: clubFormData.logoUrl,
        club_admin_id: userId
      });
      
      if (insertError) {
        console.error("Error using security definer function:", insertError);
        throw new Error(`Failed to create club: ${insertError.message}`);
      }
      
      if (!clubId) {
        console.error("No club ID returned from security definer function");
        throw new Error('No club ID returned from club creation');
      }
      
      console.log("Successfully created club with security definer function, club ID:", clubId);
      
      // Update the club with additional fields
      const updateData = {
        tagline: clubFormData.tagline || null,
        established_year: clubFormData.establishedYear ? parseInt(clubFormData.establishedYear) : null,
        affiliation: clubFormData.affiliation || null,
        why_join: clubFormData.whyJoin || null,
        regular_events: regularEvents,
        signature_events: signatureEvents,
        community_engagement: clubFormData.communityEngagement || null,
        who_can_join: clubFormData.whoCanJoin || null,
        membership_fee: clubFormData.membershipFee || 'Free',
        how_to_join: clubFormData.howToJoin || null,
        president_name: clubFormData.presidentName || null,
        president_contact: clubFormData.presidentContact || null,
        executive_members: executiveMembers,
        advisors: advisors,
        phone_number: clubFormData.phoneNumber || null,
        website: clubFormData.website || null,
        facebook_link: clubFormData.facebookLink || null,
        instagram_link: clubFormData.instagramLink || null,
        twitter_link: clubFormData.twitterLink || null,
        discord_link: clubFormData.discordLink || null,
        document_url: clubFormData.documentUrl || null,
        document_name: clubFormData.documentName || null
      };
      
      // Log the update data for debugging
      logFormData(updateData, "Club Update Data");
      
      const { error: updateError } = await supabase
        .from('clubs')
        .update(updateData)
        .eq('id', clubId);
      
      if (updateError) {
        console.error("Error updating club with additional fields:", updateError);
        throw new Error(`Failed to update club: ${updateError.message}`);
      }
      
      console.log("Successfully updated club with additional fields");
      
      // Get the club data to return - use maybeSingle() instead of single()
      const { data: clubData, error: getError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .maybeSingle();
          
      if (getError) {
        console.error("Error fetching created club:", getError);
        throw new Error(`Failed to fetch club data: ${getError.message}`);
      }
      
      // Check if we got the club data back
      if (!clubData) {
        console.error("No club data found after querying by ID:", clubId);
        // Instead of throwing, return the basic club data we know
        return {
          id: clubId,
          name: clubFormData.name,
          description: clubFormData.description,
          category: clubFormData.category,
          university: clubFormData.university,
          university_id: universityId,
          logo_url: clubFormData.logoUrl,
          status: 'pending'
        };
      }
      
      console.log("Final club data:", clubData);
      return clubData;
    } else {
      throw new Error('User ID is required to create a club');
    }
  } catch (error: any) {
    console.error("Error in insertClubData:", error);
    throw error;
  }
};
