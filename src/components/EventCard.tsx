
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import EventCardBase from '@/components/ui/event-card/EventCardBase';
import EventCardImage from '@/components/ui/event-card/EventCardImage';
import EventCardDetails from '@/components/ui/event-card/EventCardDetails';
import EventParticipants from '@/components/ui/event-card/EventParticipants';

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
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
          <EventParticipants 
            participants={event.participants} 
            maxParticipants={event.maxParticipants} 
          />
        }
      >
        <EventCardDetails 
          organizerName={event.organizer.name}
          title={event.title}
          description={event.description}
          date={event.date}
          location={event.location}
        />
      </EventCardBase>
    </Link>
  );
};

export default EventCard;
