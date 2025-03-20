
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEventAttendees } from '@/hooks/club-admin/useEventAttendees';
import { useToast } from '@/hooks/use-toast';
import AttendeeControls from './attendee-management/AttendeeControls';
import AttendeeStats from './attendee-management/AttendeeStats';
import AttendeeTabs from './attendee-management/AttendeeTabs';

interface AttendeeManagementProps {
  eventId: string;
  eventTitle: string;
}

const AttendeeManagement: React.FC<AttendeeManagementProps> = ({ eventId, eventTitle }) => {
  const { 
    attendees, 
    isLoading, 
    fetchAttendees, 
    checkInAttendee, 
    exportAttendees 
  } = useEventAttendees(eventId);
  
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');

  useEffect(() => {
    if (eventId) {
      fetchAttendees().catch(error => {
        console.error("Error fetching attendees:", error);
        toast({
          title: 'Error',
          description: 'Failed to load attendees. Please try again.',
          variant: 'destructive',
        });
      });
    }
  }, [eventId]);

  const handleCheckIn = async (attendeeId: string) => {
    try {
      const success = await checkInAttendee(attendeeId);
      if (success) {
        await fetchAttendees();
        toast({
          title: 'Success',
          description: 'Attendee checked in successfully.',
        });
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      toast({
        title: 'Error',
        description: 'Failed to check in attendee. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'checked-in') return matchesSearch && attendee.checked_in;
    if (activeTab === 'not-checked-in') return matchesSearch && !attendee.checked_in;
    
    return matchesSearch;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendee Management</CardTitle>
        <CardDescription>Manage attendees for {eventTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <AttendeeControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExport={exportAttendees}
        />

        <AttendeeTabs
          attendees={filteredAttendees}
          isLoading={isLoading}
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value as any)}
          onCheckIn={handleCheckIn}
          formatDate={formatDate}
        />
      </CardContent>
      <CardFooter>
        <AttendeeStats
          totalAttendees={attendees.length}
          checkedInCount={attendees.filter(a => a.checked_in).length}
          onRefresh={() => fetchAttendees()}
        />
      </CardFooter>
    </Card>
  );
};

export default AttendeeManagement;
