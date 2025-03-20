import { supabase } from '@/integrations/supabase/client';
import { checkExistingReview } from './fetchReviews';

// Submit a new review
export const submitNewReview = async (
  eventId: string, 
  userId: string, 
  rating: number, 
  reviewText: string
): Promise<{ success: boolean; data: any }> => {
  try {
    // Check if the user already has a review for this event
    const existingReview = await checkExistingReview(eventId, userId);
    
    if (existingReview) {
      // If review exists, update it instead of creating a new one
      return await updateExistingReview(existingReview.id, rating, reviewText);
    }
    
    // Otherwise create a new review
    const reviewData = {
      event_id: eventId,
      user_id: userId,
      rating,
      review_text: reviewText || null,
    };
    
    const { data, error } = await supabase
      .from('event_reviews')
      .insert(reviewData)
      .select();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error submitting new review:', error);
    throw new Error(error.message || 'Failed to submit review');
  }
};

// Update an existing review
export const updateExistingReview = async (
  reviewId: string, 
  rating: number, 
  reviewText: string
): Promise<{ success: boolean; data: any }> => {
  try {
    const { data, error } = await supabase
      .from('event_reviews')
      .update({ 
        rating, 
        review_text: reviewText || null, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', reviewId)
      .select();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating existing review:', error);
    throw new Error(error.message || 'Failed to update review');
  }
};
