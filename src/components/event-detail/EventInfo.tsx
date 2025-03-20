
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface EventInfoProps {
  date: string;
  location: string;
  participants: number;
  maxParticipants?: number;
}

const EventInfo: React.FC<EventInfoProps> = ({ date, location, participants, maxParticipants }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <Calendar className="w-5 h-5 mr-3 text-primary mt-0.5" />
        <div>
          <p className="font-medium">Date</p>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
      </div>
      <div className="flex items-start">
        <Clock className="w-5 h-5 mr-3 text-primary mt-0.5" />
        <div>
          <p className="font-medium">Time</p>
          <p className="text-muted-foreground">{formattedTime}</p>
        </div>
      </div>
      <div className="flex items-start">
        <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
        <div>
          <p className="font-medium">Location</p>
          <p className="text-muted-foreground">{location}</p>
        </div>
      </div>
      <div className="flex items-start">
        <Users className="w-5 h-5 mr-3 text-primary mt-0.5" />
        <div>
          <p className="font-medium">Participants</p>
          <p className="text-muted-foreground">
            {participants} {maxParticipants ? `/ ${maxParticipants}` : ''} registered
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
