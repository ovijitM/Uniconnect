
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>All registered users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={
                      user.role === 'admin' ? 'default' : 
                      user.role === 'club_admin' ? 'outline' : 'secondary'
                    }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTable;
