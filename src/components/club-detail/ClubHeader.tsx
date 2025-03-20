
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Club } from '@/types';
import { useLazyImage } from '@/utils/animations';

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
        <div 
          className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {currentSrc && (
          <img 
            src={currentSrc} 
            alt={club.name} 
            className="object-contain w-full h-full p-2"
          />
        )}
      </div>
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {club.category}
          </Badge>
          {getStatusBadge(club.status)}
        </div>
        <h1 className="text-3xl font-semibold mb-2">{club.name}</h1>
        <div className="flex items-center text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          {club.memberCount} members
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
