
import React from 'react';
import { Badge } from '@/components/ui/badge';

type ClubStatus = 'approved' | 'rejected' | 'pending';

interface StatusBadgeProps {
  status: ClubStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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

export default StatusBadge;
