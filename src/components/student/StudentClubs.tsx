
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ExternalLink, LogOut, Loader2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface StudentClubsProps {
  clubs: any[];
  isLoading: boolean;
  onLeaveClub?: (clubId: string) => Promise<void>;
}

const StudentClubs: React.FC<StudentClubsProps> = ({ clubs, isLoading, onLeaveClub }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leavingClubId, setLeavingClubId] = useState<string | null>(null);
  
  console.log("StudentClubs - Clubs:", clubs);
  
  const handleLeaveClub = async (clubId: string, clubName: string) => {
    if (!onLeaveClub) {
      toast({
        title: "Action not available",
        description: "Unable to leave club at this time.",
        variant: "destructive",
      });
      return;
    }
    
    // Confirm before leaving
    if (window.confirm(`Are you sure you want to leave ${clubName}?`)) {
      setLeavingClubId(clubId);
      try {
        await onLeaveClub(clubId);
        toast({
          title: "Success",
          description: `You have left ${clubName}`,
          variant: "default",
        });
      } catch (error: any) {
        console.error('Error leaving club:', error);
        toast({
          title: "Failed to leave club",
          description: error.message || "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLeavingClubId(null);
      }
    }
  };
  
  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Clubs</CardTitle>
            <CardDescription>Clubs you are a member of</CardDescription>
          </div>
          {clubs.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm" 
              onClick={() => navigate('/student-dashboard/clubs')}
            >
              More <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
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
                  <div className="mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Joined
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {onLeaveClub && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleLeaveClub(club.id, club.name)}
                      disabled={leavingClubId === club.id}
                    >
                      {leavingClubId === club.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
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
            <p className="text-muted-foreground">You haven't joined any clubs yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentClubs;
