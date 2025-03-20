
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Club {
  id: string;
  name: string;
  category: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

interface ClubsTableRowProps {
  club: Club;
  processingId: string | null;
  onApprove: (clubId: string) => void;
  onReject: (clubId: string) => void;
  onView: (clubId: string) => void;
}

const ClubsTableRow: React.FC<ClubsTableRowProps> = ({
  club,
  processingId,
  onApprove,
  onReject,
  onView
}) => {
  return (
    <TableRow key={club.id}>
      <TableCell className="font-medium">{club.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{club.category}</Badge>
      </TableCell>
      <TableCell><StatusBadge status={club.status} /></TableCell>
      <TableCell>{new Date(club.created_at).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {club.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApprove(club.id)}
                disabled={processingId === club.id}
                className="bg-green-100 hover:bg-green-200"
              >
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onReject(club.id)}
                disabled={processingId === club.id}
                className="bg-red-100 hover:bg-red-200"
              >
                <X className="h-4 w-4 mr-1" /> Reject
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView(club.id)}
          >
            View
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ClubsTableRow;
