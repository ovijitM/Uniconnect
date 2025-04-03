
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clubs.map(club => (
          <ClubCard 
            key={club.id} 
            club={club}
            onJoin={onJoinClub}
            isJoined={joinedClubIds.includes(club.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedClubsSection;
