
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { EventReview } from './types/reviewTypes';
import { 
  fetchAverageRating, 
  fetchReviewsWithProfiles, 
  submitNewReview, 
  updateExistingReview, 
  deleteUserReview 
} from './utils/reviewUtils';

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
  const pageSize = 5; // Show 5 reviews per page
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch all reviews for the event with pagination
  const fetchReviews = async (page: number = currentPage) => {
    if (!eventId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch average rating
      const avgRating = await fetchAverageRating(eventId);
      setAverageRating(avgRating);
      
      // Fetch reviews with user details (paginated)
      const { reviews: formattedReviews, totalCount } = await fetchReviewsWithProfiles(
        eventId,
        page,
        pageSize
      );
      
      setReviews(formattedReviews);
      setTotalReviews(totalCount);
      setTotalPages(Math.max(1, Math.ceil(totalCount / pageSize)));
      
      // Check if current user has a review
      if (user?.id) {
        // We need to check all reviews to find user's review, not just the current page
        const { reviews: allUserReviews } = await fetchReviewsWithProfiles(
          eventId,
          1, 
          1000 // Large number to get all reviews (we'll optimize this later if needed)
        );
        
        const userReview = allUserReviews.find(r => r.userId === user.id);
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
  
  // Change page
  const changePage = (page: number) => {
    setCurrentPage(page);
    fetchReviews(page);
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
      fetchReviews(1); // Reset to first page when eventId changes
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
    submitReview,
    deleteReview,
    fetchReviews,
    changePage
  };
};
