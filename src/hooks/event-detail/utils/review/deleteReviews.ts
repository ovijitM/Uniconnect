
import { supabase } from '@/integrations/supabase/client';

// Delete a review
export const deleteUserReview = async (reviewId: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('event_reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user review:', error);
    throw new Error(error.message || 'Failed to delete review');
  }
};
