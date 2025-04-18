
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Mail, ExternalLink, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Club } from '@/types';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from '@/components/ui/badge';

interface ClubSidebarProps {
  club: Club;
  events: any[];
  isMember: boolean;
  isJoining: boolean;
  handleJoinClub: () => void;
  relatedClubs: Club[];
}

const ClubSidebar: React.FC<ClubSidebarProps> = ({ 
  club, 
  events, 
  isMember, 
  isJoining,
  handleJoinClub,
  relatedClubs 
}) => {
  
  console.log("ClubSidebar rendered with isMember:", isMember);
  
  // Log membership status changes for debugging
  useEffect(() => {
    console.log(`Membership status for club ${club.id} changed to: ${isMember ? 'Member' : 'Not a member'}`);
  }, [isMember, club.id]);
  
  const renderJoinButton = () => {
    if (club.status !== 'approved') {
      return (
        <Alert variant="warning" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>This club is not yet approved</AlertDescription>
        </Alert>
      );
    }
    
    return isMember ? (
      <Button className="w-full mt-4 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border border-green-200" disabled variant="outline">
        <Check className="mr-2 h-4 w-4" /> Member
      </Button>
    ) : (
      <Button 
        className="w-full mt-4" 
        onClick={handleJoinClub}
        disabled={isJoining}
      >
        {isJoining ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...
          </>
        ) : (
          <>Join Club</>
        )}
      </Button>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-6">
        {renderJoinButton()}

        {club.status === 'rejected' && !club.rejectionReason && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This club has been rejected by administrators.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-3 text-primary" />
            <div>
              <p className="font-medium">Events</p>
              <p className="text-muted-foreground">{events.length} total events</p>
            </div>
          </div>
          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-primary" />
            <div>
              <p className="font-medium">Contact</p>
              <p className="text-muted-foreground">{club.name.toLowerCase().replace(/\s+/g, '')}@university.edu</p>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t">
          <Button variant="outline" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Website
          </Button>
        </div>
      </div>

      {relatedClubs.length > 0 && (
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-medium mb-4">Related Clubs</h3>
          <div className="space-y-4">
            {relatedClubs.map(relatedClub => (
              <div key={relatedClub.id} className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                  <img 
                    src={relatedClub.logoUrl || "https://images.unsplash.com/photo-1493612276216-ee3925520721"} 
                    alt={relatedClub.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <Link to={`/clubs/${relatedClub.id}`} className="font-medium hover:text-primary">
                    {relatedClub.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubSidebar;
