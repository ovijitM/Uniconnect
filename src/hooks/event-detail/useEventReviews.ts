import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fetchReviews, submitReview, deleteReview } from './utils/review';

interface UseEventReviewsProps {
  eventId: string;
}

const useEventReviews = ({ eventId }: UseEventReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const fetchedReviews = await fetchReviews(eventId);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error fetching reviews",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [eventId]);

  const addReview = async (comment: string, rating: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit a review.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const newReview = await submitReview(eventId, user.id, comment, rating);
      setReviews(prevReviews => [newReview, ...prevReviews]);
      toast({
        title: "Review submitted",
        description: "Your review has been successfully submitted.",
      });
      return true;
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeReview = async (reviewId: string) => {
    setIsLoading(true);
    try {
      await deleteReview(reviewId);
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error deleting review",
        description: error.message || "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reviews,
    isLoading,
    addReview,
    removeReview,
    reloadReviews: loadReviews,
  };
};

export default useEventReviews;
