
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EventReview } from '@/hooks/event-detail/useEventReviews';
import { StarRating } from '@/components/ui/star-rating';

interface EventReviewFormProps {
  userReview: EventReview | null;
  onSubmit: (rating: number, reviewText: string) => Promise<void>;
  onDelete: () => Promise<void>;
  isSubmitting: boolean;
  isLoggedIn: boolean;
}

const EventReviewForm: React.FC<EventReviewFormProps> = ({
  userReview,
  onSubmit,
  onDelete,
  isSubmitting,
  isLoggedIn
}) => {
  const [rating, setRating] = useState<number>(userReview?.rating || 5);
  const [reviewText, setReviewText] = useState<string>(userReview?.reviewText || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, reviewText);
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
          {userReview ? 'Update Review' : 'Submit Review'}
        </Button>
        
        {userReview && (
          <Button
            type="button"
            onClick={onDelete}
            variant="outline"
            disabled={isSubmitting}
          >
            Delete Review
          </Button>
        )}
      </div>
    </form>
  );
};

export default EventReviewForm;
