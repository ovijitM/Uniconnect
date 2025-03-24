
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EventReview } from './types/reviewTypes';
import { 
  fetchAverageRating, 
  fetchReviewsWithProfiles, 
  submitNewReview, 
  deleteUserReview,
  checkExistingReview
} from './utils/review';

export type { EventReview } from './types/reviewTypes';

export const useEventReviews = (eventId: string | undefined) => {
  const [reviews, setReviews] = useState<EventReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [userReview, setUserReview] = useState<EventReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 5; // Show 5 reviews per page
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchReviews = async (page: number = currentPage) => {
    if (!eventId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const avgRating = await fetchAverageRating(eventId);
      setAverageRating(avgRating);
      
      const { reviews: formattedReviews, totalCount } = await fetchReviewsWithProfiles(
        eventId,
        page,
        pageSize
      );
      
      setReviews(formattedReviews);
      setTotalReviews(totalCount);
      setTotalPages(Math.max(1, Math.ceil(totalCount / pageSize)));
      
      if (user?.id) {
        try {
          const userReview = await checkExistingReview(eventId, user.id);
          setUserReview(userReview);
        } catch (error) {
          console.error('Error checking for user review:', error);
        }
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      setError('Could not load reviews. Please try again later.');
      toast({
        title: 'Error',
        description: 'Could not load reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const changePage = (page: number) => {
    setCurrentPage(page);
    fetchReviews(page);
  };
  
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
      setError(null);
      
      await submitNewReview(eventId, user.id, rating, reviewText);
      
      toast({
        title: userReview ? 'Review updated' : 'Review submitted',
        description: userReview 
          ? 'Your review has been updated successfully' 
          : 'Thank you for your feedback!',
      });
      
      await fetchReviews(1); // Reload first page after submission
      setCurrentPage(1);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteReview = async () => {
    if (!userReview || !user?.id) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await deleteUserReview(userReview.id);
      
      toast({
        title: 'Review deleted',
        description: 'Your review has been removed',
      });
      
      setUserReview(null);
      await fetchReviews(1); // Reload first page
      setCurrentPage(1);
    } catch (error: any) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (eventId) {
      fetchReviews(1);
      setCurrentPage(1);
    }
  }, [eventId, user?.id]);
  
  return {
    reviews,
    averageRating,
    userReview,
    isLoading,
    isSubmitting,
    currentPage,
    totalPages,
    totalReviews,
    pageSize,
    error,
    submitReview,
    deleteReview,
    fetchReviews,
    changePage
  };
};
