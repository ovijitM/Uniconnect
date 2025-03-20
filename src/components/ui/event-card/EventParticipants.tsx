
import React from 'react';
import { Users } from 'lucide-react';

interface EventParticipantsProps {
  participants: number;
  maxParticipants?: number;
}

const EventParticipants: React.FC<EventParticipantsProps> = ({ participants, maxParticipants }) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <Users className="w-4 h-4 mr-2" />
      {participants} {maxParticipants ? `/ ${maxParticipants}` : ''} participants
    </div>
  );
};

export default EventParticipants;
