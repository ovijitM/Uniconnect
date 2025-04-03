
import React from 'react';
import { EventReview } from '@/hooks/event-detail/types/reviewTypes';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ReviewItem from './ReviewItem';
import ReviewsLoading from './ReviewsLoading';
import ReviewPagination from './ReviewPagination';

interface ReviewsListContentProps {
  reviews: EventReview[];
  isLoading: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ReviewsListContent: React.FC<ReviewsListContentProps> = ({
  reviews,
  isLoading,
  error,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading) {
    return <ReviewsLoading />;
  }
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review this event!
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
      
      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <ReviewPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  );
};

export default ReviewsListContent;
