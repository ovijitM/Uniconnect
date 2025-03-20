
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardDetailsProps {
  organizerName: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  organizerName,
  title,
  description,
  date,
  location
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <div className="mb-2">
        <p className="text-xs font-medium text-muted-foreground">{organizerName}</p>
      </div>
      <h3 className="text-xl font-medium mb-2 line-clamp-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {formattedDate}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          {location}
        </div>
      </div>
    </>
  );
};

export default EventCardDetails;
