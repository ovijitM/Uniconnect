
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collaboration, Club } from '@/types';
import { HandshakeIcon, UserPlusIcon, CheckCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CollaborationItemProps {
  club: Club;
  isIncoming: boolean;
  requestId?: string;
  onAccept?: (collaborationId: string) => void;
  onReject?: (collaborationId: string) => void;
  isPending?: boolean;
}

const CollaborationItem: React.FC<CollaborationItemProps> = ({ 
  club, 
  isIncoming, 
  requestId, 
  onAccept, 
  onReject,
  isPending = false
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg mb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={club.logoUrl || ''} alt={club.name} />
          <AvatarFallback>{club.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium text-sm">{club.name}</h4>
          <p className="text-xs text-muted-foreground">{club.category}</p>
        </div>
      </div>
      
      {isIncoming && requestId && (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onAccept?.(requestId)}
            disabled={!onAccept || isPending}
            className="h-8 px-2"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Accept
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onReject?.(requestId)}
            disabled={!onReject || isPending}
            className="h-8 px-2"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
      
      {!isIncoming && (
        <Badge variant="outline" className="bg-muted">
          Pending
        </Badge>
      )}
    </div>
  );
};

interface ClubCollaborationsProps {
  incomingRequests: Collaboration[];
  outgoingRequests: Collaboration[];
  acceptedCollaborations: Collaboration[];
  isLoading: boolean;
  onAccept: (collaborationId: string) => void;
  onReject: (collaborationId: string) => void;
  isPending?: boolean;
}

const ClubCollaborations: React.FC<ClubCollaborationsProps> = ({
  incomingRequests,
  outgoingRequests,
  acceptedCollaborations,
  isLoading,
  onAccept,
  onReject,
  isPending = false
}) => {
  const { toast } = useToast();

  // Get the partner club (the one that's not the current club)
  const getPartnerClub = (collaboration: Collaboration): Club | undefined => {
    // For an accepted collaboration, we need to determine which club to show
    return collaboration.requesterClub && collaboration.requestedClub 
      ? collaboration.requesterClub 
      : undefined;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <HandshakeIcon className="h-5 w-5 text-primary" />
          Club Collaborations
        </CardTitle>
        <CardDescription>
          Manage collaboration requests and partnerships with other clubs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            {incomingRequests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <UserPlusIcon className="h-4 w-4 mr-2 text-primary" />
                  Incoming Requests ({incomingRequests.length})
                </h3>
                {incomingRequests.map(request => (
                  <CollaborationItem 
                    key={request.id}
                    club={request.requesterClub!}
                    isIncoming={true}
                    requestId={request.id}
                    onAccept={onAccept}
                    onReject={onReject}
                    isPending={isPending}
                  />
                ))}
              </div>
            )}
            
            {outgoingRequests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Outgoing Requests ({outgoingRequests.length})</h3>
                {outgoingRequests.map(request => (
                  <CollaborationItem 
                    key={request.id}
                    club={request.requestedClub!}
                    isIncoming={false}
                  />
                ))}
              </div>
            )}
            
            {acceptedCollaborations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <HandshakeIcon className="h-4 w-4 mr-2 text-primary" />
                  Active Collaborations ({acceptedCollaborations.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {acceptedCollaborations.map(collab => {
                    const partnerClub = getPartnerClub(collab);
                    if (!partnerClub) return null;
                    
                    return (
                      <div key={collab.id} className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={partnerClub.logoUrl || ''} alt={partnerClub.name} />
                          <AvatarFallback>{partnerClub.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-sm">{partnerClub.name}</h4>
                          <p className="text-xs text-muted-foreground">{partnerClub.category}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {incomingRequests.length === 0 && outgoingRequests.length === 0 && acceptedCollaborations.length === 0 && (
              <div className="text-center py-6">
                <HandshakeIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
                <p className="text-muted-foreground">No collaboration requests or partnerships yet</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubCollaborations;
