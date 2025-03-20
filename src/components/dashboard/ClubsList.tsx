
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClubsListProps {
  clubs: any[];
  isLoading: boolean;
}

const ClubsList: React.FC<ClubsListProps> = ({ clubs, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Clubs</CardTitle>
        <CardDescription>Clubs you administer</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : clubs.length > 0 ? (
          <div className="space-y-4">
            {clubs.map(club => (
              <div key={club.id} className="flex items-center p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No clubs yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubsList;
