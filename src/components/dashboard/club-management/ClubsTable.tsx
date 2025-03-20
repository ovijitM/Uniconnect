
import React from 'react';
import { Club } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import ClubStatusBadge from './ClubStatusBadge';
import { Skeleton } from '@/components/ui/skeleton';

interface ClubsTableProps {
  clubs: Club[];
  isLoading: boolean;
  onEditClub: (club: Club) => void;
  onDeleteClub: (club: Club) => void;
}

const ClubsTable: React.FC<ClubsTableProps> = ({
  clubs,
  isLoading,
  onEditClub,
  onDeleteClub,
}) => {
  if (isLoading) {
    return <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />;
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">You don't have any clubs to manage yet.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clubs.map(club => (
          <TableRow key={club.id}>
            <TableCell className="font-medium">{club.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{club.category}</Badge>
            </TableCell>
            <TableCell>
              <ClubStatusBadge status={club.status || 'pending'} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditClub(club)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDeleteClub(club)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClubsTable;
