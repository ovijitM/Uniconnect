
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
      <div className="mb-1">
        <p className="text-xs font-medium text-muted-foreground">{organizerName}</p>
      </div>
      <h3 className="text-base font-medium mb-1 line-clamp-2">{title}</h3>
      {tagline && (
        <p className="text-xs text-muted-foreground mb-1 italic line-clamp-1">{tagline}</p>
      )}
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{description}</p>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{formattedDate}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{formattedEventType}</span>
        </div>
        {rating !== undefined && rating > 0 && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Star className={cn("w-3 h-3 mr-1 flex-shrink-0", rating > 0 && "fill-yellow-400 text-yellow-400")} />
            <span>{rating.toFixed(1)} / 5</span>
          </div>
        )}
      </div>
    </>
  );
};

export default EventCardDetails;
