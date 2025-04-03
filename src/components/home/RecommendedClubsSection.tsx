
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Club } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import ClubCard from '@/components/ClubCard';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendedClubsSectionProps {
  recommendations: Club[];
  isLoading: boolean;
  onJoinClub?: (clubId: string) => Promise<void>;
  joinedClubIds?: string[];
}

const RecommendedClubsSection: React.FC<RecommendedClubsSectionProps> = ({
  recommendations,
  isLoading,
  onJoinClub,
  joinedClubIds = []
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Recommended For You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden border shadow-sm">
              <CardContent className="p-0">
                <div className="space-y-3">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="pt-2">
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Recommended For You</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/clubs')}
          className="text-sm font-medium"
        >
          View All <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recommendations.map((club) => (
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

export default RecommendedClubsSection;
