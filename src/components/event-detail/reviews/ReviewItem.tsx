
import React from 'react';
import { EventReview } from '@/hooks/event-detail/useEventReviews';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { StarRating } from '@/components/ui/star-rating';

interface ReviewItemProps {
  review: EventReview;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <div className="border-b pb-4 last:border-0">
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
  );
};

export default ReviewItem;
