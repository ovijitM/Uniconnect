
import React from 'react';
import { EventReview } from '@/hooks/event-detail/types/reviewTypes';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ReviewsListContent } from './reviews';

interface EventReviewsListProps {
  reviews: EventReview[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const EventReviewsList: React.FC<EventReviewsListProps> = (props) => {
  return (
    <ErrorBoundary onReset={props.onRetry}>
      <ReviewsListContent {...props} />
    </ErrorBoundary>
  );
};

export default EventReviewsList;
