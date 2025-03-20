
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLazyImage } from '@/utils/animations';

interface FeaturedEventProps {
  event: Event;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ event }) => {
  const { isLoaded, currentSrc } = useLazyImage(event.imageUrl);
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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
      className="relative rounded-2xl overflow-hidden glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex flex-col lg:flex-row">
        <div className="relative lg:w-1/2 h-64 lg:h-auto">
          <div 
            className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {currentSrc && (
            <img 
              src={currentSrc} 
              alt={event.title} 
              className="object-cover w-full h-full"
            />
          )}
        </div>

        <div className="lg:w-1/2 p-6 lg:p-8">
          <div className="flex justify-between items-start mb-4">
            <Badge className={`${statusColors[event.status]} capitalize`}>
              {event.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {event.category}
            </Badge>
          </div>

          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">{event.title}</h2>
          <p className="text-muted-foreground mb-6">{event.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-3 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-3 text-primary" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-3 text-primary" />
              <span>
                {event.participants} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''} participants
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                {event.organizer.logoUrl && (
                  <img 
                    src={event.organizer.logoUrl} 
                    alt={event.organizer.name} 
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{event.organizer.name}</p>
                <p className="text-xs text-muted-foreground">Organizer</p>
              </div>
            </div>

            <Link to={`/events/${event.id}`}>
              <Button className="group">
                View Details
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedEvent;
