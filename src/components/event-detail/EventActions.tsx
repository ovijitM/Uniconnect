
import React from 'react';
import { User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventActionsProps {
  status: string;
  isParticipating: boolean;
  onParticipate: () => void;
}

const EventActions: React.FC<EventActionsProps> = ({ status, isParticipating, onParticipate }) => {
  if (status !== 'upcoming') {
    return null;
  }

  return (
    <div>
      {isParticipating ? (
        <Button
          className="w-full"
          variant="outline"
          disabled
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Registered
        </Button>
      ) : (
        <Button
          className="w-full"
          onClick={onParticipate}
        >
          <User className="mr-2 h-4 w-4" />
          Register for this event
        </Button>
      )}
    </div>
  );
};

export default EventActions;
