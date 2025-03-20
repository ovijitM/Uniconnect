
import { supabase } from '@/integrations/supabase/client';
import { EventReview, EventReviewWithProfile } from '../types/reviewTypes';

// Fetch average rating for an event
export const fetchAverageRating = async (eventId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('get_event_avg_rating', { event_id: eventId });
    
    if (error) throw error;
    return Number(data) || 0;
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return 0; // Return default value on error
  }
};

// Fetch reviews with user details
export const fetchReviewsWithProfiles = async (eventId: string): Promise<EventReview[]> => {
  try {
    const { data, error } = await supabase
      .from('event_reviews')
      .select(`
        id,
        event_id,
        user_id,
        rating,
        review_text,
        created_at,
        profiles:user_id(name, profile_image)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log("Fetched reviews data:", data);
    
    // Format reviews with user details
    return (data as unknown as EventReviewWithProfile[]).map(review => {
      return {
        id: review.id,
        eventId: review.event_id,
        userId: review.user_id,
        rating: review.rating,
        reviewText: review.review_text,
        createdAt: review.created_at,
        userName: review.profiles?.name || 'Anonymous',
        userImage: review.profiles?.profile_image || null
      };
    });
  } catch (error) {
    console.error('Error fetching reviews with profiles:', error);
    return []; // Return empty array on error
  }
};

// Submit a new review
export const submitNewReview = async (
  eventId: string, 
  userId: string, 
  rating: number, 
  reviewText: string
): Promise<{ success: boolean; data: any }> => {
  try {
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
  } catch (error) {
    console.error('Error submitting new review:', error);
    throw error;
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
  } catch (error) {
    console.error('Error updating existing review:', error);
    throw error;
  }
};

// Delete a review
export const deleteUserReview = async (reviewId: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('event_reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user review:', error);
    throw error;
  }
};
