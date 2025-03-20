
import React from 'react';
import { Button } from '@/components/ui/button';

interface AttendeeStatsProps {
  totalAttendees: number;
  checkedInCount: number;
  onRefresh: () => void;
}

const AttendeeStats: React.FC<AttendeeStatsProps> = ({
  totalAttendees,
  checkedInCount,
  onRefresh
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-sm text-muted-foreground">
        Total Attendees: {totalAttendees} | Checked In: {checkedInCount}
      </div>
      <Button onClick={onRefresh} variant="outline" size="sm">
        Refresh
      </Button>
    </div>
  );
};

export default AttendeeStats;
