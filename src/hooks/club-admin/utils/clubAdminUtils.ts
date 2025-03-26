
import { supabase } from '@/integrations/supabase/client';

export const addClubAdmin = async (clubId: string, userId: string): Promise<void> => {
  console.log(`Adding user ${userId} as admin for club ${clubId}`);
  
  try {
    // First check if this admin relationship already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('club_admins')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking for existing admin relationship:', checkError);
    }
    
    // Only insert if it doesn't exist
    if (!existingAdmin) {
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
    } else {
      console.log('Admin relationship already exists, no need to add again');
    }
  } catch (error) {
    console.error('Error in addClubAdmin function:', error);
    throw error;
  }
};
