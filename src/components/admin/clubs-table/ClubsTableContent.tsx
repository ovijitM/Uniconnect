
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import ClubsTableRow from './ClubsTableRow';

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

interface ClubsTableContentProps {
  clubs: Club[];
  isLoading: boolean;
  processingId: string | null;
  onApprove: (clubId: string) => void;
  onReject: (clubId: string) => void;
  onView: (clubId: string) => void;
}

const ClubsTableContent: React.FC<ClubsTableContentProps> = ({
  clubs,
  isLoading,
  processingId,
  onApprove,
  onReject,
  onView
}) => {
  if (isLoading) {
    return <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Documents</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clubs.map(club => (
          <ClubsTableRow
            key={club.id}
            club={club}
            processingId={processingId}
            onApprove={onApprove}
            onReject={onReject}
            onView={onView}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ClubsTableContent;
