
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

// Fetch reviews with user details (with pagination)
export const fetchReviewsWithProfiles = async (
  eventId: string,
  page: number = 1,
  pageSize: number = 5
): Promise<{ 
  reviews: EventReview[],
  totalCount: number 
}> => {
  try {
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // First get total count
    const { count, error: countError } = await supabase
      .from('event_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', eventId);
    
    if (countError) throw countError;
    
    // Then fetch paginated data with profile information
    // Join with profiles table using the user_id column
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
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    console.log("Fetched paginated reviews data:", data);
    
    // Format reviews with user details
    const formattedReviews = data.map(review => {
      // Safely access profile data with proper type handling
      let userName = 'Anonymous';
      let userImage = null;
      
      // Add null check before trying to access properties
      if (review.profiles && typeof review.profiles === 'object' && !('error' in review.profiles)) {
        const profileData = review.profiles as any;
        userName = profileData.name || 'Anonymous';
        userImage = profileData.profile_image || null;
      }
      
      return {
        id: review.id,
        eventId: review.event_id,
        userId: review.user_id,
        rating: review.rating,
        reviewText: review.review_text,
        createdAt: review.created_at,
        userName,
        userImage
      };
    });
    
    return { 
      reviews: formattedReviews,
      totalCount: count || 0
    };
  } catch (error) {
    console.error('Error fetching reviews with profiles:', error);
    throw error; // Propagate error to be caught by error boundary
  }
};

// Check if user has already submitted a review for this event
export const checkExistingReview = async (
  eventId: string,
  userId: string
): Promise<EventReview | null> => {
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
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Safely access profile data with proper type handling
    let userName = 'Anonymous';
    let userImage = null;
    
    // Add null check before trying to access properties
    if (data.profiles && typeof data.profiles === 'object' && !('error' in data.profiles)) {
      const profileData = data.profiles as any;
      userName = profileData.name || 'Anonymous';
      userImage = profileData.profile_image || null;
    }
    
    // Format the review
    return {
      id: data.id,
      eventId: data.event_id,
      userId: data.user_id,
      rating: data.rating,
      reviewText: data.review_text,
      createdAt: data.created_at,
      userName,
      userImage
    };
  } catch (error) {
    console.error('Error checking existing review:', error);
    throw error;
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
