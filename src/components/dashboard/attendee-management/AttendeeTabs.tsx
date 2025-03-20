
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendeeTable from './AttendeeTable';
import { Attendee } from '@/hooks/club-admin/useEventAttendees';

interface AttendeeTabsProps {
  attendees: Attendee[];
  isLoading: boolean;
  activeTab: 'all' | 'checked-in' | 'not-checked-in';
  onTabChange: (value: string) => void;
  onCheckIn: (attendeeId: string) => void;
  formatDate: (dateString: string) => string;
}

const AttendeeTabs: React.FC<AttendeeTabsProps> = ({
  attendees,
  isLoading,
  activeTab,
  onTabChange,
  onCheckIn,
  formatDate
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Attendees</TabsTrigger>
        <TabsTrigger value="checked-in">Checked In</TabsTrigger>
        <TabsTrigger value="not-checked-in">Not Checked In</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <AttendeeTable 
          attendees={attendees} 
          isLoading={isLoading} 
          onCheckIn={onCheckIn} 
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="checked-in" className="mt-0">
        <AttendeeTable 
          attendees={attendees} 
          isLoading={isLoading} 
          onCheckIn={onCheckIn} 
          formatDate={formatDate}
        />
      </TabsContent>
      
      <TabsContent value="not-checked-in" className="mt-0">
        <AttendeeTable 
          attendees={attendees} 
          isLoading={isLoading} 
          onCheckIn={onCheckIn} 
          formatDate={formatDate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AttendeeTabs;
