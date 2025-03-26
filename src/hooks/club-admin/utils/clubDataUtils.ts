
import { supabase } from '@/integrations/supabase/client';
import { ClubFormData } from '../types';
import { parseArrayField, parseExecutiveMembers } from './dataTransformUtils';
import { Json } from '@/integrations/supabase/types';

export const insertClubData = async (
  clubFormData: ClubFormData, 
  universityId: string
) => {
  // Transform array and JSON fields
  const regularEvents = parseArrayField(clubFormData.regularEvents);
  const signatureEvents = parseArrayField(clubFormData.signatureEvents);
  const advisors = parseArrayField(clubFormData.advisors);
  const executiveMembers = parseExecutiveMembers(clubFormData.executiveMembers);

  // Create the club
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
    throw new Error(`Failed to create club: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    throw new Error('No club data returned after creation');
  }
  
  return data[0];
};
