
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, UserCheck } from 'lucide-react';
import { Attendee } from '@/hooks/club-admin/useEventAttendees';

interface AttendeeTableProps {
  attendees: Attendee[];
  isLoading: boolean;
  onCheckIn: (attendeeId: string) => void;
  formatDate: (dateString: string) => string;
}

const AttendeeTable: React.FC<AttendeeTableProps> = ({ 
  attendees, 
  isLoading, 
  onCheckIn,
  formatDate
}) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="text-sm text-muted-foreground">Loading attendees...</div>
        </div>
      </div>
    );
  }

  if (attendees.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <UserCheck className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No attendees found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map(attendee => (
            <TableRow key={attendee.user_id}>
              <TableCell className="font-medium">{attendee.name}</TableCell>
              <TableCell>{attendee.email}</TableCell>
              <TableCell>{formatDate(attendee.created_at)}</TableCell>
              <TableCell>
                {attendee.checked_in ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Checked In
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Not Checked In
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {attendee.checked_in_at ? formatDate(attendee.checked_in_at) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCheckIn(attendee.user_id)}
                  disabled={attendee.checked_in}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {attendee.checked_in ? 'Checked In' : 'Check In'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendeeTable;
