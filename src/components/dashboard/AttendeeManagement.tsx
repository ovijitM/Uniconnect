
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, FileText, Search, UserCheck } from 'lucide-react';
import { useEventAttendees, Attendee } from '@/hooks/club-admin/useEventAttendees';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AttendeeManagementProps {
  eventId: string;
  eventTitle: string;
}

const AttendeeManagement: React.FC<AttendeeManagementProps> = ({ eventId, eventTitle }) => {
  const { attendees, isLoading, fetchAttendees, checkInAttendee, exportAttendees } = useEventAttendees(eventId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');

  useEffect(() => {
    if (eventId) {
      fetchAttendees();
    }
  }, [eventId]);

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'checked-in') return matchesSearch && attendee.checked_in;
    if (activeTab === 'not-checked-in') return matchesSearch && !attendee.checked_in;
    
    return matchesSearch;
  });

  const handleCheckIn = async (attendeeId: string) => {
    const success = await checkInAttendee(attendeeId);
    if (success) {
      fetchAttendees();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendee Management</CardTitle>
        <CardDescription>Manage attendees for {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search attendees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportAttendees('csv')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportAttendees('pdf')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Attendees</TabsTrigger>
            <TabsTrigger value="checked-in">Checked In</TabsTrigger>
            <TabsTrigger value="not-checked-in">Not Checked In</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <AttendeeTable 
              attendees={filteredAttendees} 
              isLoading={isLoading} 
              onCheckIn={handleCheckIn} 
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="checked-in" className="mt-0">
            <AttendeeTable 
              attendees={filteredAttendees} 
              isLoading={isLoading} 
              onCheckIn={handleCheckIn} 
              formatDate={formatDate}
            />
          </TabsContent>
          
          <TabsContent value="not-checked-in" className="mt-0">
            <AttendeeTable 
              attendees={filteredAttendees} 
              isLoading={isLoading} 
              onCheckIn={handleCheckIn} 
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-muted-foreground">
          Total Attendees: {attendees.length} | Checked In: {attendees.filter(a => a.checked_in).length}
        </div>
        <Button onClick={fetchAttendees} variant="outline" size="sm">
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

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
                  <Badge variant="success" className="bg-green-100 text-green-800">
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

export default AttendeeManagement;
