
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ClubStatusBadgeProps {
  status: string;
}

const ClubStatusBadge: React.FC<ClubStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-500">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'pending':
    default:
      return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
  }
};

export default ClubStatusBadge;
