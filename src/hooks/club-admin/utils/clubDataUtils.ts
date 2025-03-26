import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from '../types';
import { parseArrayField, parseExecutiveMembers } from './dataTransformUtils';

export const insertClubData = async (
  clubFormData: ClubFormData, 
  universityId: string,
  userId?: string
) => {
  // Log the data being inserted
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
      console.log("Using security definer function to create club");
      const { data, error } = await supabase.rpc('insert_club', {
        name: clubFormData.name,
        description: clubFormData.description,
        category: clubFormData.category,
        university: clubFormData.university,
        university_id: universityId,
        logo_url: clubFormData.logoUrl,
        club_admin_id: userId
      });
      
      if (error) {
        console.error("Error using security definer function:", error);
        // Fall back to direct insert if the function fails
      } else {
        console.log("Successfully created club with security definer function, club ID:", data);
        
        // If the RPC worked, we still need to update the club with additional fields
        // that weren't included in the function parameters
        const { data: updatedData, error: updateError } = await supabase
          .from('clubs')
          .update({
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
          })
          .eq('id', data)
          .select();
        
        if (updateError) {
          console.error("Error updating club with additional fields:", updateError);
          console.log("Update payload:", {
            tagline: clubFormData.tagline,
            established_year: clubFormData.establishedYear ? parseInt(clubFormData.establishedYear) : null,
            affiliation: clubFormData.affiliation,
            // ... other fields
          });
        } else {
          console.log("Successfully updated club with additional fields:", updatedData);
        }
        
        // Get the club data to return
        const { data: clubData, error: getError } = await supabase
          .from('clubs')
          .select('*')
          .eq('id', data)
          .single();
          
        if (getError) {
          console.error("Error fetching created club:", getError);
          throw new Error(`Failed to fetch club data: ${getError.message}`);
        }
        
        // Add a flag to indicate this was created with the RPC function
        const returnData = {
          ...clubData,
          created_with_rpc: true
        };
        
        console.log("Final club data:", returnData);
        return returnData;
      }
    }

    // Regular insert as a fallback
    console.log("Attempting direct insert as fallback");
    const { data, error } = await supabase
      .from('clubs')
      .insert({
        name: clubFormData.name,
        description: clubFormData.description,
        category: clubFormData.category,
        logo_url: clubFormData.logoUrl,
        status: 'pending',
        university: clubFormData.university,
        university_id: universityId,
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
      })
      .select();
    
    if (error) {
      console.error("Database error creating club:", error);
      throw new Error(`Failed to create club: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.error("No club data returned after creation");
      throw new Error('No club data returned after creation');
    }
    
    console.log("Successfully created club data:", data[0]);
    return data[0];
  } catch (error: any) {
    console.error("Error in insertClubData:", error);
    throw error;
  }
};
