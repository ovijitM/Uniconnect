
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLazyImage } from '@/utils/animations';

interface FeaturedEventSectionProps {
  featuredEvent: Event | null;
  isLoading: boolean;
}

const FeaturedEventSection: React.FC<FeaturedEventSectionProps> = ({ featuredEvent, isLoading }) => {
  const { isLoaded, currentSrc } = useLazyImage(featuredEvent?.imageUrl || '');
  
  if (isLoading) {
    return (
      <div className="rounded-xl overflow-hidden">
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!featuredEvent) {
    return (
      <div className="text-center py-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border">
        <h3 className="text-xl font-medium mb-3">No Featured Events</h3>
        <p className="text-muted-foreground mb-6">Check back later for featured events.</p>
        <Link to="/events">
          <Button variant="outline" className="group">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(featuredEvent.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    ongoing: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
    past: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">Featured Event</h2>
      </div>

      <div className="relative rounded-xl overflow-hidden border bg-card">
        <div className="relative h-56 md:h-72 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 transition-opacity duration-500 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {currentSrc && (
            <img
              src={currentSrc}
              alt={featuredEvent.title}
              className="object-cover w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/40"></div>
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`${statusColors[featuredEvent.status]} capitalize`}>
              {featuredEvent.status}
            </Badge>
            <Badge variant="outline" className="bg-black/20 backdrop-blur-sm capitalize border-white/20 text-white">
              {featuredEvent.category}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{featuredEvent.title}</h2>
          <p className="text-muted-foreground line-clamp-2 mb-4">{featuredEvent.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <span>{featuredEvent.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>
                {featuredEvent.participants} {featuredEvent.maxParticipants ? `/ ${featuredEvent.maxParticipants}` : ''} participants
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-3">
                {featuredEvent.organizer.logoUrl && (
                  <img
                    src={featuredEvent.organizer.logoUrl}
                    alt={featuredEvent.organizer.name}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{featuredEvent.organizer.name}</p>
                <p className="text-xs text-muted-foreground">Organizer</p>
              </div>
            </div>

            <Link to={`/events/${featuredEvent.id}`}>
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

export default FeaturedEventSection;
