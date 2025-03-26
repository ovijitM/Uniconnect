
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StudentClubsProps {
  clubs: any[];
  isLoading: boolean;
}

const StudentClubs: React.FC<StudentClubsProps> = ({ clubs, isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Clubs</CardTitle>
        <CardDescription>Clubs you are a member of</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : clubs.length > 0 ? (
          <div className="space-y-4">
            {clubs.map(club => (
              <div key={club.id} className="flex items-center p-3 bg-secondary/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{club.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {club.description}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/clubs/${club.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
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
