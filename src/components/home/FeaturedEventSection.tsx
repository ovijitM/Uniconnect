
import React from 'react';
import FeaturedEvent from '@/components/FeaturedEvent';
import { Event } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedEventSectionProps {
  featuredEvent: Event | null;
  isLoading: boolean;
}

const FeaturedEventSection: React.FC<FeaturedEventSectionProps> = ({ featuredEvent, isLoading }) => {
  return (
    <div className="mb-12">
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : featuredEvent ? (
        <FeaturedEvent event={featuredEvent} />
      ) : (
        <div className="text-center py-8 mb-12 bg-secondary/30 rounded-xl">
          <h3 className="text-lg font-medium mb-2">No featured events</h3>
          <p className="text-muted-foreground">Check back later for featured events.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedEventSection;
