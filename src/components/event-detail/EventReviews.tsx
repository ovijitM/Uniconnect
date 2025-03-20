
import React from 'react';
import { useEventReviews } from '@/hooks/event-detail/useEventReviews';
import { useAuth } from '@/contexts/AuthContext';
import EventReviewForm from './EventReviewForm';
import EventReviewsList from './EventReviewsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from '@/components/ui/star-rating';

interface EventReviewsProps {
  eventId: string;
}

const EventReviews: React.FC<EventReviewsProps> = ({ eventId }) => {
  const { 
    reviews, 
    averageRating, 
    userReview, 
    isLoading, 
    isSubmitting, 
    submitReview, 
    deleteReview 
  } = useEventReviews(eventId);
  
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  const reviewCount = reviews.length;
  
  return (
    <div className="glass-panel rounded-xl p-6 space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
        
        <div className="flex items-center space-x-2">
          <StarRating value={Math.round(averageRating)} readOnly />
          <span className="text-muted-foreground">
            {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>
      
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="write-review">Write a Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="py-4">
          <EventReviewsList reviews={reviews} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="write-review" className="py-4">
          <EventReviewForm
            userReview={userReview}
            onSubmit={submitReview}
            onDelete={deleteReview}
            isSubmitting={isSubmitting}
            isLoggedIn={isLoggedIn}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventReviews;
