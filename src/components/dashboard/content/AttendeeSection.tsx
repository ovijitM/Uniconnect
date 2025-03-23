
import React from 'react';
import AttendeeManagement from '../AttendeeManagement';

interface AttendeeSectionProps {
  eventId: string;
  eventTitle: string;
}

const AttendeeSection: React.FC<AttendeeSectionProps> = ({
  eventId,
  eventTitle
}) => {
  return (
    <div className="mb-6">
      <AttendeeManagement 
        eventId={eventId}
        eventTitle={eventTitle}
      />
    </div>
  );
};

export default AttendeeSection;
