
import React from 'react';
import { User, CheckCircle, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventActionsProps {
  status: string;
  isParticipating: boolean;
  onParticipate: () => void;
  onUnregister?: () => void;
}

const EventActions: React.FC<EventActionsProps> = ({ 
  status, 
  isParticipating, 
  onParticipate,
  onUnregister 
}) => {
  if (status !== 'upcoming') {
    return null;
  }

  return (
    <div className="space-y-2">
      {isParticipating ? (
        <>
          <Button
            className="w-full"
            variant="outline"
            disabled
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Registered
          </Button>
          {onUnregister && (
            <Button
              className="w-full"
              variant="destructive"
              onClick={onUnregister}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cancel Registration
            </Button>
          )}
        </>
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
