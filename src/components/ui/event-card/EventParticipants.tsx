
import React from 'react';
import { Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EventParticipantsProps {
  participants: number;
  maxParticipants?: number;
}

const EventParticipants: React.FC<EventParticipantsProps> = ({
  participants,
  maxParticipants
}) => {
  const progress = maxParticipants 
    ? Math.min(Math.round((participants / maxParticipants) * 100), 100)
    : 0;
  
  return (
    <div className="w-full flex flex-col space-y-1">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center">
          <Users className="h-3 w-3 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">
            {participants}{maxParticipants ? ` / ${maxParticipants}` : ''}
          </span>
        </div>
        {maxParticipants && (
          <span className={`text-xs ${progress >= 80 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {progress}%
          </span>
        )}
      </div>
      {maxParticipants && (
        <Progress 
          value={progress} 
          className="h-1.5" 
          indicatorClassName={progress >= 80 ? 'bg-red-500' : ''}
        />
      )}
    </div>
  );
};

export default EventParticipants;
