
import React from 'react';
import { User, CheckCircle, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventActionsProps {
  status: string;
  isParticipating: boolean;
  onParticipate: () => void;
  onUnregister?: () => void;
  isDisabled?: boolean;
  disabledReason?: string;
}

const EventActions: React.FC<EventActionsProps> = ({ 
  status, 
  isParticipating, 
  onParticipate,
  onUnregister,
  isDisabled,
  disabledReason
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
          disabled={isDisabled}
          title={disabledReason}
        >
          <User className="mr-2 h-4 w-4" />
          Register for this event
        </Button>
      )}
      
      {isDisabled && disabledReason && (
        <p className="text-xs text-amber-600 mt-1">{disabledReason}</p>
      )}
    </div>
  );
};

export default EventActions;
