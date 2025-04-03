
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EventReview } from '@/hooks/event-detail/types/reviewTypes';
import { StarRating } from '@/components/ui/star-rating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface EventReviewFormProps {
  userReview: EventReview | null;
  onSubmit: (rating: number, reviewText: string) => Promise<boolean>;
  onDelete: () => Promise<void>;
  isSubmitting: boolean;
  isLoggedIn: boolean;
  onRetry?: () => void;
}

const ReviewFormContent: React.FC<EventReviewFormProps> = ({
  userReview,
  onSubmit,
  onDelete,
  isSubmitting,
  isLoggedIn
}) => {
  const [rating, setRating] = useState<number>(userReview?.rating || 5);
  const [reviewText, setReviewText] = useState<string>(userReview?.reviewText || '');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (rating < 1) {
      setError("Please select a rating");
      return;
    }
    
    try {
      await onSubmit(rating, reviewText);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="bg-secondary/30 rounded-lg p-4 text-center">
        <p>Sign in to leave a review for this event.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Rating
        </label>
        <StarRating
          value={rating}
          onChange={setRating}
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <label htmlFor="review-text" className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <Textarea
          id="review-text"
          placeholder="Share your experience with this event..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          disabled={isSubmitting}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-between">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
        </Button>
        
        {userReview && (
          <Button
            type="button"
            onClick={onDelete}
            variant="outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Delete Review'}
          </Button>
        )}
      </div>
    </form>
  );
};

const EventReviewForm: React.FC<EventReviewFormProps> = (props) => {
  return (
    <ErrorBoundary onReset={props.onRetry}>
      <ReviewFormContent {...props} />
    </ErrorBoundary>
  );
};

export default EventReviewForm;
