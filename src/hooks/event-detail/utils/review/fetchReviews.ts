
import { supabase } from '@/integrations/supabase/client';
import { EventReview, EventReviewWithProfile } from '../../types/reviewTypes';

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
      // Default values
      let userName = 'Anonymous';
      let userImage = null;
      
      // Add explicit null check before trying to access properties
      if (review.profiles && typeof review.profiles === 'object') {
        // Type guard to make sure profiles is an object
        const profileData = review.profiles as Record<string, any>;
        // Check if this is not an error object
        if (profileData && !('error' in profileData)) {
          userName = profileData.name || 'Anonymous';
          userImage = profileData.profile_image || null;
        }
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
    
    // Default values
    let userName = 'Anonymous';
    let userImage = null;
    
    // Add explicit null check before trying to access properties
    if (data.profiles && typeof data.profiles === 'object') {
      // Type guard to make sure profiles is an object
      const profileData = data.profiles as Record<string, any>;
      // Check if this is not an error object
      if (profileData && !('error' in profileData)) {
        userName = profileData.name || 'Anonymous';
        userImage = profileData.profile_image || null;
      }
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
