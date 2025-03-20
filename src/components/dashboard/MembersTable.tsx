
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface MembersTableProps {
  members: any[];
  isLoading: boolean;
}

const MembersTable: React.FC<MembersTableProps> = ({ members, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  // Get unique club IDs
  const clubNames = [...new Set(members.map(member => member.clubName))];
  
  // Filter members based on search term and selected club
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      !searchTerm || 
      member.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClub = !selectedClub || member.clubName === selectedClub;
    
    return matchesSearch && matchesClub;
  });

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Club Members</CardTitle>
          <CardDescription>All members across your clubs</CardDescription>
          
          <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {clubNames.map(clubName => (
                <Badge
                  key={clubName}
                  variant={selectedClub === clubName ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedClub(selectedClub === clubName ? null : clubName)}
                >
                  {clubName}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          ) : filteredMembers.length > 0 ? (
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
                {filteredMembers.map((member, index) => (
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
              <p className="text-muted-foreground">No members found</p>
              {searchTerm && <p className="text-sm text-muted-foreground mt-2">Try adjusting your search</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersTable;
