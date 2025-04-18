
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Spinner } from '@/components/ui/spinner';

interface Club {
  id: string;
  name: string;
  category: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  document_url?: string;
  document_name?: string;
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
  const isProcessing = processingId === club.id;
  
  return (
    <TableRow key={club.id}>
      <TableCell className="font-medium">{club.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{club.category}</Badge>
      </TableCell>
      <TableCell><StatusBadge status={club.status} /></TableCell>
      <TableCell>{new Date(club.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        {club.document_url && (
          <a 
            href={club.document_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FileText className="h-4 w-4 mr-1" />
            <span className="text-xs">{club.document_name || 'Document'}</span>
          </a>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {club.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onApprove(club.id)}
                disabled={isProcessing}
                className="bg-green-100 hover:bg-green-200"
              >
                {isProcessing ? <Spinner className="h-4 w-4 mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                {isProcessing ? 'Processing...' : 'Approve'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onReject(club.id)}
                disabled={isProcessing}
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
            disabled={isProcessing}
          >
            View
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ClubsTableRow;
