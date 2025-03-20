
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Club {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

interface ClubsTableProps {
  clubs: Club[];
  isLoading: boolean;
  onViewClub: (clubId: string) => void;
}

const ClubsTable: React.FC<ClubsTableProps> = ({
  clubs,
  isLoading,
  onViewClub
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Club Management</CardTitle>
        <CardDescription>All clubs in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
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
                  <TableCell>{new Date(club.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewClub(club.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubsTable;
