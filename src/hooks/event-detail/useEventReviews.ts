import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { EventReview } from './types/reviewTypes';
import { 
  fetchReviewsWithProfiles, 
  checkExistingReview, 
  fetchAverageRating 
} from './utils/review/fetchReviews';
import { submitNewReview } from './utils/review/submitReviews';
import { deleteUserReview } from './utils/review/deleteReviews';

interface UseEventReviewsProps {
  eventId: string;
}

export interface EventReviewsResult {
  reviews: EventReview[];
  isLoading: boolean;
  addReview: (comment: string, rating: number) => Promise<boolean>;
  removeReview: (reviewId: string) => Promise<void>;
  reloadReviews: () => Promise<void>;
  averageRating: number;
  userReview: EventReview | null;
  isSubmitting: boolean;
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  error: string | null;
  fetchReviews: () => Promise<void>;
  changePage: (page: number) => void;
  submitReview: (rating: number, reviewText: string) => Promise<boolean>;
  deleteReview: () => Promise<void>;
}

const REVIEWS_PER_PAGE = 5;

const useEventReviews = (eventId: string): EventReviewsResult => {
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userReview, setUserReview] = useState<EventReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const totalPages = Math.max(1, Math.ceil(totalReviews / REVIEWS_PER_PAGE));

  const loadReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { reviews: fetchedReviews, totalCount } = await fetchReviewsWithProfiles(
        eventId,
        currentPage,
        REVIEWS_PER_PAGE
      );
      
      setReviews(fetchedReviews);
      setTotalReviews(totalCount);
      
      const avgRating = await fetchAverageRating(eventId);
      setAverageRating(avgRating);
      
      if (user) {
        const existingReview = await checkExistingReview(eventId, user.id);
        setUserReview(existingReview);
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again.");
      toast({
        title: "Error fetching reviews",
        description: error.message || "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [eventId, currentPage, user?.id]);

  const addReview = async (comment: string, rating: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit a review.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      await submitNewReview(eventId, user.id, rating, comment);
      toast({
        title: "Review submitted",
        description: "Your review has been successfully submitted.",
      });
      
      setCurrentPage(1);
      await loadReviews();
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
      setIsSubmitting(false);
    }
  };

  const submitReview = async (rating: number, reviewText: string) => {
    return addReview(reviewText, rating);
  };

  const removeReview = async (reviewId: string) => {
    setIsSubmitting(true);
    try {
      await deleteUserReview(reviewId);
      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted.",
      });
      
      await loadReviews();
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error deleting review",
        description: error.message || "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async () => {
    if (!userReview) {
      toast({
        title: "No review found",
        description: "You don't have a review to delete.",
        variant: "destructive",
      });
      return;
    }

    await removeReview(userReview.id);
    setUserReview(null);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    reviews,
    isLoading,
    addReview,
    removeReview,
    reloadReviews: loadReviews,
    averageRating,
    userReview,
    isSubmitting,
    currentPage,
    totalPages,
    totalReviews,
    error,
    fetchReviews: loadReviews,
    changePage,
    submitReview,
    deleteReview
  };
};

export default useEventReviews;
