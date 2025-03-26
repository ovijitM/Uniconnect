
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Tag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface AvailableClubsProps {
  clubs: any[];
  joinedClubIds: string[];
  isLoading: boolean;
  onJoinClub: (clubId: string) => Promise<void>;
}

const AvailableClubs: React.FC<AvailableClubsProps> = ({ 
  clubs, 
  joinedClubIds, 
  isLoading, 
  onJoinClub 
}) => {
  // Filter out clubs that the student has already joined
  const availableClubs = clubs.filter(club => !joinedClubIds.includes(club.id));
  
  // Add local state to track which club is being joined
  const [joiningClubId, setJoiningClubId] = useState<string | null>(null);
  
  const handleJoinClub = async (clubId: string) => {
    if (joiningClubId) return; // Prevent multiple clicks
    
    setJoiningClubId(clubId);
    try {
      await onJoinClub(clubId);
    } catch (error: any) {
      console.error('Error in handleJoinClub:', error);
      toast({
        title: "Failed to join club",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setJoiningClubId(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Clubs</CardTitle>
        <CardDescription>Clubs you can join</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : availableClubs.length > 0 ? (
          <div className="space-y-4">
            {availableClubs.map(club => (
              <div key={club.id} className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{club.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {club.description}
                  </p>
                  <div className="mt-1">
                    <Badge variant="outline" className="mr-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {club.category}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleJoinClub(club.id)}
                  disabled={joiningClubId === club.id}
                >
                  {joiningClubId === club.id ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Joining...
                    </>
                  ) : 'Join'}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No available clubs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableClubs;
