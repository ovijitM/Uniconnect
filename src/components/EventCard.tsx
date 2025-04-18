
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import EventCardBase from '@/components/ui/event-card/EventCardBase';
import EventCardImage from '@/components/ui/event-card/EventCardImage';
import EventCardDetails from '@/components/ui/event-card/EventCardDetails';
import EventParticipants from '@/components/ui/event-card/EventParticipants';
import { supabase } from '@/integrations/supabase/client';
import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
  const [rating, setRating] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (!event.id) return;
        
        const { data, error } = await supabase
          .rpc('get_event_avg_rating', { event_id: event.id });
        
        if (error) {
          console.error('Error fetching event rating:', error);
          return;
        }
        
        setRating(Number(data) || 0);
      } catch (error) {
        console.error('Error in rating fetch:', error);
      }
    };
    
    fetchRating();
  }, [event.id]);

  return (
    <Link to={`/events/${event.id}`}>
      <EventCardBase 
        index={index}
        imageContainer={
          <EventCardImage 
            imageUrl={event.imageUrl} 
            title={event.title} 
            status={event.status} 
          />
        }
        footer={
          <div className="flex justify-between items-center">
            <EventParticipants 
              participants={event.participants} 
              maxParticipants={event.maxParticipants} 
            />
            {event.visibility === 'university_only' && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span className="text-xs">University Only</span>
              </Badge>
            )}
          </div>
        }
        className="h-full"
      >
        <EventCardDetails 
          organizerName={event.organizer.name}
          title={event.title}
          description={event.description}
          date={event.date}
          location={event.location}
          eventType={event.eventType}
          tagline={event.tagline}
          rating={rating}
        />
      </EventCardBase>
    </Link>
  );
};

export default EventCard;
