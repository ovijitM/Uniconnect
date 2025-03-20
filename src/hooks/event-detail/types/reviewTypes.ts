
export interface EventReview {
  id: string;
  eventId: string;
  userId: string;
  rating: number;
  reviewText: string | null;
  createdAt: string;
  userName?: string;
  userImage?: string;
}

export interface EventReviewWithProfile {
  id: string;
  event_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles: {
    name: string;
    profile_image: string | null;
  } | null;
}
