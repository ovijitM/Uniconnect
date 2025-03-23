
import React from 'react';
import UpcomingEvents from '../UpcomingEvents';
import ClubsList from '../ClubsList';

interface QuickViewSectionProps {
  events: any[];
  clubs: any[];
  isLoading: boolean;
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
}

const QuickViewSection: React.FC<QuickViewSectionProps> = ({
  events,
  clubs,
  isLoading,
  onEditEvent,
  onViewEvent
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <UpcomingEvents 
        events={events}
        isLoading={isLoading}
        onEditEvent={onEditEvent}
        onViewEvent={onViewEvent}
      />

      <ClubsList 
        clubs={clubs}
        isLoading={isLoading}
      />
    </div>
  );
};

export default QuickViewSection;
