
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import ClubsTableRow from './ClubsTableRow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  
  if (!clubs || clubs.length === 0) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Clubs Found</AlertTitle>
        <AlertDescription>
          There are no clubs to display. New club applications will appear here.
        </AlertDescription>
      </Alert>
    );
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
