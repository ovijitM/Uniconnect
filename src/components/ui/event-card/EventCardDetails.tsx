
import React from 'react';
import { Calendar, MapPin, Tag, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventCardDetailsProps {
  organizerName: string;
  title: string;
  description: string;
  date: string;
  location: string;
  eventType?: string;
  tagline?: string;
  rating?: number;
}

const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  organizerName,
  title,
  description,
  date,
  location,
  eventType,
  tagline,
  rating
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedEventType = eventType ? (
    eventType === 'in-person' ? 'In-person' : 
    eventType === 'online' ? 'Online' : 
    eventType === 'hybrid' ? 'Hybrid' : 
    eventType
  ) : 'In-person';

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
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="w-4 h-4 mr-2" />
          {formattedEventType}
        </div>
        {rating !== undefined && rating > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className={cn("w-4 h-4 mr-2", rating > 0 && "fill-yellow-400 text-yellow-400")} />
            {rating.toFixed(1)} / 5
          </div>
        )}
      </div>
    </>
  );
};

export default EventCardDetails;
