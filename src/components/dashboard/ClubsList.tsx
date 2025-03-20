
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ClubsListProps {
  clubs: any[];
  isLoading: boolean;
}

const ClubsList: React.FC<ClubsListProps> = ({ clubs, isLoading }) => {
  const getStatusIndicator = (status: string, rejectionReason?: string) => {
    switch (status) {
      case 'approved':
        return null; // No indicator for approved clubs
      case 'rejected':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-red-100 p-1 rounded-full ml-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Rejected</p>
                {rejectionReason && <p className="text-xs mt-1">{rejectionReason}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'pending':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-yellow-100 p-1 rounded-full ml-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pending admin approval</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

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
              <div 
                key={club.id} 
                className={`flex items-center p-3 rounded-lg hover:bg-secondary transition-colors ${
                  club.status === 'rejected' ? 'bg-red-50' : 
                  club.status === 'pending' ? 'bg-yellow-50' : 
                  'bg-secondary/50'
                }`}
              >
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-semibold">{club.name}</h4>
                    {getStatusIndicator(club.status, club.rejection_reason)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {club.description}
                  </p>
                  <div className="mt-1 flex items-center">
                    <Badge variant="outline" className="mr-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {club.category}
                    </Badge>
                    {club.status !== 'approved' && (
                      <span className="text-xs ml-2">
                        {club.status === 'pending' 
                          ? 'Awaiting approval' 
                          : 'Rejected by admin'}
                      </span>
                    )}
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
