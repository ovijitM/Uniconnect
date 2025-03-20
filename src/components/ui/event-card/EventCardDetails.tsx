
import React from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';

interface EventCardDetailsProps {
  organizerName: string;
  title: string;
  description: string;
  date: string;
  location: string;
  eventType?: string;
  tagline?: string;
}

const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  organizerName,
  title,
  description,
  date,
  location,
  eventType,
  tagline
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
      <h3 className="text-xl font-medium mb-1 line-clamp-2">{title}</h3>
      {tagline && (
        <p className="text-sm text-muted-foreground mb-2 italic line-clamp-1">{tagline}</p>
      )}
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
        {eventType && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Tag className="w-4 h-4 mr-2" />
            {eventType}
          </div>
        )}
      </div>
    </>
  );
};

export default EventCardDetails;
