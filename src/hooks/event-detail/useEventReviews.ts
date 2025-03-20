
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
      const { data: avgData, error: avgError } = await supabase
        .rpc('get_event_avg_rating', { event_id: eventId });
      
      if (avgError) throw avgError;
      setAverageRating(Number(avgData) || 0);
      
      // Fetch reviews with user details
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
      
      // Format reviews with user details
      const formattedReviews = data.map(review => {
        // Safely access profiles data with type checking
        const profileData = review.profiles as { name?: string; profile_image?: string } | null;
        
        return {
          id: review.id,
          eventId: review.event_id,
          userId: review.user_id,
          rating: review.rating,
          reviewText: review.review_text,
          createdAt: review.created_at,
          userName: profileData?.name || 'Anonymous',
          userImage: profileData?.profile_image || null
        };
      });
      
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
      
      const reviewData = {
        event_id: eventId,
        user_id: user.id,
        rating,
        review_text: reviewText || null,
      };
      
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('event_reviews')
          .update({ rating, review_text: reviewText || null, updated_at: new Date().toISOString() })
          .eq('id', userReview.id);
        
        if (error) throw error;
        
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully',
          variant: 'success',
        });
      } else {
        // Insert new review
        const { error } = await supabase
          .from('event_reviews')
          .insert(reviewData);
        
        if (error) throw error;
        
        toast({
          title: 'Review submitted',
          description: 'Thank you for your feedback!',
          variant: 'success',
        });
      }
      
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
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
      
      const { error } = await supabase
        .from('event_reviews')
        .delete()
        .eq('id', userReview.id);
      
      if (error) throw error;
      
      toast({
        title: 'Review deleted',
        description: 'Your review has been removed',
        variant: 'info',
      });
      
      setUserReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fetch reviews on component mount or when eventId changes
  useEffect(() => {
    fetchReviews();
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
