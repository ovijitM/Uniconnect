
import { supabase } from '@/integrations/supabase/client';

export const addClubAdmin = async (clubId: string, userId: string): Promise<void> => {
  console.log(`Adding user ${userId} as admin for club ${clubId}`);
  
  const { error } = await supabase
    .from('club_admins')
    .insert({
      club_id: clubId,
      user_id: userId,
    });
  
  if (error) {
    console.error('Error adding club admin:', error);
    throw new Error(`Failed to add user as admin: ${error.message}`);
  }
  
  console.log('Successfully added club admin');
};
