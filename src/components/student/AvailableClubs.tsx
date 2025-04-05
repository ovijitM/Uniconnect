import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ExternalLink, Loader2, PlusCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AvailableClubsProps {
  clubs: any[];
  joinedClubIds: string[];
  isLoading: boolean;
  onJoinClub?: (clubId: string) => Promise<void>;
}

const AvailableClubs: React.FC<AvailableClubsProps> = ({ 
  clubs, 
  joinedClubIds, 
  isLoading, 
  onJoinClub 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [joiningClubId, setJoiningClubId] = useState<string | null>(null);
  const [localJoinedIds, setLocalJoinedIds] = useState<string[]>(joinedClubIds || []);
  
  // Update local state when props change
  useEffect(() => {
    console.log("AvailableClubs - JoinedClubIds from props:", joinedClubIds);
    setLocalJoinedIds(joinedClubIds || []);
  }, [joinedClubIds]);
  
  const handleJoinClub = async (clubId: string, clubName: string) => {
    if (!onJoinClub) {
      toast({
        title: "Action not available",
        description: "Unable to join clubs at this time.",
        variant: "destructive",
      });
      return;
    }
    
    // Prevent joining if already a member
    if (isClubJoined(clubId)) {
      toast({
        title: "Already a member",
        description: `You are already a member of ${clubName}`,
        variant: "default",
      });
      return;
    }
    
    setJoiningClubId(clubId);
    try {
      // Optimistically update UI
      setLocalJoinedIds(prev => [...prev, clubId]);
      
      await onJoinClub(clubId);
      
      toast({
        title: "Success",
        description: `You have joined ${clubName}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error joining club:', error);
      // Revert optimistic update on error
      setLocalJoinedIds(prev => prev.filter(id => id !== clubId));
      
      toast({
        title: "Failed to join club",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setJoiningClubId(null);
    }
  };
  
  const isClubJoined = (clubId: string) => {
    return localJoinedIds.includes(clubId);
  };
  
  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <CardTitle>Available Clubs</CardTitle>
        <CardDescription>Clubs you can join</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : clubs.length > 0 ? (
          <div className="space-y-3">
            {clubs.map(club => (
              <div key={club.id} className="flex items-center p-3 hover:bg-secondary/20 rounded-lg transition-colors">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{club.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {club.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {onJoinClub && !isClubJoined(club.id) ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                      onClick={() => handleJoinClub(club.id, club.name)}
                      disabled={joiningClubId === club.id}
                    >
                      {joiningClubId === club.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <PlusCircle className="h-4 w-4 mr-1" />
                      )}
                      <span>Join</span>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-green-500"
                      disabled
                    >
                      <Check className="h-4 w-4 mr-1" />
                      <span>Joined</span>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/clubs/${club.id}`)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No available clubs to join</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableClubs;
