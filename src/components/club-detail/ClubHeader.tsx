
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, ExternalLink, Mail, Phone } from 'lucide-react';
import { Club } from '@/types';
import { useLazyImage } from '@/utils/animations';
import { Button } from '@/components/ui/button';

interface ClubHeaderProps {
  club: Club;
  isAdmin: boolean;
  isClubAdmin: boolean;
}

const ClubHeader: React.FC<ClubHeaderProps> = ({ club, isAdmin, isClubAdmin }) => {
  const { isLoaded, currentSrc } = useLazyImage(club?.logoUrl || '');

  const getStatusBadge = (status: string = 'pending') => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-100">Pending Approval</Badge>;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
      <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        {currentSrc && (
          <img 
            src={currentSrc} 
            alt={club.name} 
            className="object-contain w-full h-full p-2"
          />
        )}
      </div>
      <div className="flex-1">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {club.category}
          </Badge>
          {getStatusBadge(club.status)}
          {club.establishedYear && (
            <Badge variant="outline">Est. {club.establishedYear}</Badge>
          )}
        </div>
        <h1 className="text-3xl font-semibold mb-1">{club.name}</h1>
        {club.tagline && (
          <p className="text-lg text-muted-foreground mb-4 italic">{club.tagline}</p>
        )}
        <div className="flex items-center text-muted-foreground gap-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {club.memberCount} members
          </div>
          {club.affiliation && (
            <div className="text-sm text-muted-foreground">
              Affiliated with: {club.affiliation}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {club.website && (
            <a href={club.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" />
                Website
              </Button>
            </a>
          )}
          {club.presidentContact && (
            <a href={`mailto:${club.presidentContact}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Mail className="w-3 h-3" />
                Contact
              </Button>
            </a>
          )}
          {club.phoneNumber && (
            <a href={`tel:${club.phoneNumber}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Phone className="w-3 h-3" />
                Call
              </Button>
            </a>
          )}
        </div>
        
        {club.status === 'rejected' && club.rejectionReason && (isClubAdmin || isAdmin) && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm font-semibold text-red-700">Rejection Reason:</p>
            <p className="text-sm text-red-600">{club.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubHeader;
