
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface EventReview {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  userName?: string;
  userImage?: string;
}

// Define an interface for the raw data returned from Supabase
interface EventReviewWithProfile {
  id: string;
  event_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles: {
    name: string;
    profile_image: string | null;
  } | null;
}

// Utility function to fetch average rating
const fetchAverageRating = async (eventId: string) => {
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

// Utility function to fetch reviews with user details
const fetchReviewsWithProfiles = async (eventId: string) => {
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

// Utility function to submit a new review
const submitNewReview = async (eventId: string, userId: string, rating: number, reviewText: string) => {
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
      .select(); // Add select to get the inserted record
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting new review:', error);
    throw error;
  }
};

// Utility function to update an existing review
const updateExistingReview = async (reviewId: string, rating: number, reviewText: string) => {
  try {
    const { data, error } = await supabase
      .from('event_reviews')
      .update({ 
        rating, 
        review_text: reviewText || null, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', reviewId)
      .select(); // Add select to get the updated record
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating existing review:', error);
    throw error;
  }
};

// Utility function to delete a review
const deleteUserReview = async (reviewId: string) => {
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

export const useEventReviews = (eventId: string | undefined) => {
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<EventReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch all reviews for the event
  const fetchReviews = async () => {
    if (!eventId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch average rating
      const avgRating = await fetchAverageRating(eventId);
      setAverageRating(avgRating);
      
      // Fetch reviews with user details
      const formattedReviews = await fetchReviewsWithProfiles(eventId);
      setReviews(formattedReviews);
      
      // Check if current user has a review
      if (user?.id) {
        const userReview = formattedReviews.find(r => r.userId === user.id);
        setUserReview(userReview || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Could not load reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit a new review or update existing
  const submitReview = async (rating: number, reviewText: string) => {
    if (!eventId || !user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to submit a review',
        variant: 'warning',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (userReview) {
        // Update existing review
        await updateExistingReview(userReview.id, rating, reviewText);
        
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully',
        });
      } else {
        // Insert new review
        await submitNewReview(eventId, user.id, rating, reviewText);
        
        toast({
          title: 'Review submitted',
          description: 'Thank you for your feedback!',
        });
      }
      
      // Refresh reviews
      await fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete a review
  const deleteReview = async () => {
    if (!userReview || !user?.id) return;
    
    try {
      setIsSubmitting(true);
      
      await deleteUserReview(userReview.id);
      
      toast({
        title: 'Review deleted',
        description: 'Your review has been removed',
      });
      
      setUserReview(null);
      await fetchReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fetch reviews on component mount or when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchReviews();
    }
  }, [eventId, user?.id]);
  
  return {
    reviews,
    averageRating,
    userReview,
    isLoading,
    isSubmitting,
    submitReview,
    deleteReview,
    fetchReviews
  };
};
