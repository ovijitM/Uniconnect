
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, UsersIcon, TagIcon, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventHeaderProps {
  title: string;
  tagline?: string;
  date: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants?: number;
  visibility?: 'public' | 'university_only';
  organizerName: string;
  organizerUniversity?: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  tagline,
  date,
  location,
  category,
  participants,
  maxParticipants,
  visibility,
  organizerName,
  organizerUniversity
}) => {
  const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy h:mm a');

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="outline" className="capitalize">
          {category}
        </Badge>
        {visibility === 'university_only' && (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300">
            <Lock className="h-3 w-3" />
            <span>{organizerUniversity || 'University'} Only</span>
          </Badge>
        )}
      </div>
      
      <h1 className="text-3xl font-semibold mb-3">{title}</h1>
      
      {tagline && (
        <p className="text-lg text-muted-foreground mb-4 italic">{tagline}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="h-5 w-5" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPinIcon className="h-5 w-5" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <UsersIcon className="h-5 w-5" />
          <span>
            {participants} {maxParticipants ? `/ ${maxParticipants}` : ''} participants
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <TagIcon className="h-5 w-5" />
          <span>By {organizerName}</span>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
