
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import { useLazyImage } from '@/utils/animations';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface EventCardProps {
  event: Event;
  index?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
  const { isLoaded, currentSrc } = useLazyImage(event.imageUrl);
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    ongoing: 'bg-green-100 text-green-800 border-green-200',
    past: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <Link to={`/events/${event.id}`}>
        <Card className="overflow-hidden h-full glass-card hover:translate-y-[-4px]">
          <div className="relative h-48 overflow-hidden">
            <div 
              className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
                isLoaded ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {currentSrc && (
              <img
                src={currentSrc}
                alt={event.title}
                className="object-cover w-full h-full transition-transform duration-700 ease-apple hover:scale-105"
              />
            )}
            <div className="absolute top-3 right-3">
              <Badge className={`${statusColors[event.status]} capitalize`}>
                {event.status}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground">{event.organizer.name}</p>
            </div>
            <h3 className="text-xl font-medium mb-2 line-clamp-2">{event.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                {formattedDate}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              {event.participants} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''} participants
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default EventCard;
