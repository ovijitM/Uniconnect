
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MembersTableProps {
  members: any[];
  isLoading: boolean;
}

const MembersTable: React.FC<MembersTableProps> = ({ members, isLoading }) => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Club Members</CardTitle>
          <CardDescription>All members across your clubs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ) : members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Club</TableHead>
                  <TableHead>Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={`${member.user_id}-${member.clubId}-${index}`}>
                    <TableCell className="font-medium">{member.profiles?.name || 'Unknown User'}</TableCell>
                    <TableCell>{member.profiles?.email || 'N/A'}</TableCell>
                    <TableCell>{member.clubName}</TableCell>
                    <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No members yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersTable;
