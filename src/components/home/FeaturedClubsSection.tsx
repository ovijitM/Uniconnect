
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Club } from '@/types';
import { Button } from '@/components/ui/button';
import ClubCard from '@/components/ClubCard';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedClubsSectionProps {
  clubs: Club[];
  isLoading: boolean;
}

const FeaturedClubsSection: React.FC<FeaturedClubsSectionProps> = ({ clubs, isLoading }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">Featured Clubs</h2>
        <Link to="/clubs">
          <Button variant="ghost" className="group">
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.slice(0, 4).map((club, index) => (
            <ClubCard key={club.id} club={club} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-secondary/30 rounded-xl">
          <h3 className="text-lg font-medium mb-2">No clubs available</h3>
          <p className="text-muted-foreground">Check back later for new clubs.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedClubsSection;
