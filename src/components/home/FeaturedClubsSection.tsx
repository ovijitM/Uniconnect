
import React from 'react';
import { Club } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import ClubCard from '@/components/ClubCard';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FeaturedClubsSectionProps {
  clubs: Club[];
  isLoading: boolean;
  onJoinClub?: (clubId: string) => Promise<void>;
  joinedClubIds?: string[];
}

const FeaturedClubsSection: React.FC<FeaturedClubsSectionProps> = ({ 
  clubs, 
  isLoading,
  onJoinClub,
  joinedClubIds = []
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Featured Clubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no clubs data, display a message
  if (clubs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-2xl font-bold">Featured Clubs</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/clubs')}
            className="text-sm font-medium"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="text-center py-10 px-4 bg-card border rounded-lg">
          <p className="text-muted-foreground">No featured clubs available at the moment.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/clubs')}
          >
            Browse All Clubs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Featured Clubs</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/clubs')}
          className="text-sm font-medium"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {clubs.map((club, index) => (
          <ClubCard 
            key={club.id} 
            club={club}
            index={index}
            onJoin={onJoinClub}
            isJoined={joinedClubIds.includes(club.id)}
            size={clubs.length > 8 ? 'compact' : 'default'}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedClubsSection;
