
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Club } from '@/types';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ClubSidebarProps {
  club: Club;
  events: any[];
  isMember: boolean;
  handleJoinClub: () => void;
  relatedClubs: Club[];
}

const ClubSidebar: React.FC<ClubSidebarProps> = ({ 
  club, 
  events, 
  isMember, 
  handleJoinClub,
  relatedClubs 
}) => {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-6">
        {club.status === 'approved' ? (
          isMember ? (
            <Button className="w-full mb-4" variant="outline" disabled>
              <Users className="mr-2 h-4 w-4" />
              You are a member
            </Button>
          ) : (
            <Button className="w-full mb-4" onClick={handleJoinClub}>
              <Users className="mr-2 h-4 w-4" />
              Join Club
            </Button>
          )
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button className="w-full mb-4" disabled>
                    <Users className="mr-2 h-4 w-4" />
                    {club.status === 'pending' ? 'Pending Approval' : 'Club Rejected'}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{club.status === 'pending' 
                  ? 'This club is waiting for admin approval' 
                  : 'This club has been rejected by admin'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
