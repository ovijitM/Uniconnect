
import React from 'react';
import { EventReview } from '@/hooks/event-detail/useEventReviews';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { StarRating } from '@/components/ui/star-rating';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EventReviewsListProps {
  reviews: EventReview[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ReviewsListContent: React.FC<EventReviewsListProps> = ({
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
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="mt-2 h-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
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
        <div key={review.id} className="border-b pb-4 last:border-0">
          <div className="flex items-center space-x-4 mb-2">
            <Avatar>
              <AvatarImage src={review.userImage || undefined} alt={review.userName} />
              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{review.userName}</h4>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="ml-14">
            <div className="mb-2">
              <StarRating value={review.rating} readOnly />
            </div>
            
            {review.reviewText && (
              <p className="text-sm">{review.reviewText}</p>
            )}
          </div>
        </div>
      ))}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="my-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange?.(currentPage - 1)} 
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {/* First page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => onPageChange?.(1)}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            
            {/* Ellipsis if needed */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Previous page if not first */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => onPageChange?.(currentPage - 1)}
                  className="cursor-pointer"
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {/* Current page */}
            <PaginationItem>
              <PaginationLink 
                isActive
                className="cursor-default"
              >
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            
            {/* Next page if not last */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => onPageChange?.(currentPage + 1)}
                  className="cursor-pointer"
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {/* Ellipsis if needed */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={() => onPageChange?.(totalPages)}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange?.(currentPage + 1)} 
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const EventReviewsList: React.FC<EventReviewsListProps> = (props) => {
  return (
    <ErrorBoundary onReset={props.onRetry}>
      <ReviewsListContent {...props} />
    </ErrorBoundary>
  );
};

export default EventReviewsList;
