
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ArrowLeft, User, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLazyImage } from '@/utils/animations';
import { useToast } from '@/hooks/use-toast';

// Mock event data
const mockEvents: Record<string, Event> = {
  '1': {
    id: '1',
    title: 'Annual Tech Conference',
    description: 'Join us for a day of technology talks, workshops, and networking opportunities with industry professionals. The event will feature keynote speakers from leading tech companies, hands-on coding sessions, and panel discussions on emerging technologies. Whether you\'re a beginner or an experienced developer, there will be content tailored to your interests and skill level. Lunch and refreshments will be provided.',
    date: '2023-11-15T09:00:00',
    location: 'University Main Hall',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    organizer: {
      id: '101',
      name: 'Computer Science Society',
      description: 'A community for tech enthusiasts to collaborate, learn, and grow together through workshops, hackathons, and industry connections.',
      logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'Technology',
      memberCount: 120,
      events: []
    },
    category: 'Technology',
    status: 'upcoming',
    participants: 78,
    maxParticipants: 150
  }
};

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const { isLoaded, currentSrc } = useLazyImage(event?.imageUrl || '');
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch the event data from an API
    setIsLoading(true);
    setTimeout(() => {
      if (eventId && mockEvents[eventId]) {
        setEvent(mockEvents[eventId]);
      }
      setIsLoading(false);
    }, 500);
  }, [eventId]);

  const handleParticipate = () => {
    setIsParticipating(true);
    toast({
      title: "Successfully registered!",
      description: `You've joined the ${event?.title}`,
      variant: "default",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-80 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Event not found</h2>
          <p className="text-muted-foreground mb-6">
            The event you're looking for might have been removed or doesn't exist.
          </p>
          <Link to="/events">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(event.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    ongoing: 'bg-green-100 text-green-800 border-green-200',
    past: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-8">
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
            <div className="absolute top-4 right-4">
              <Badge className={`${statusColors[event.status]} capitalize`}>
                {event.status}
              </Badge>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="capitalize">
                {event.category}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Organized by:{' '}
                <Link to={`/clubs/${event.organizer.id}`} className="text-primary hover:underline">
                  {event.organizer.name}
                </Link>
              </div>
            </div>
            <h1 className="text-3xl font-semibold mb-4">{event.title}</h1>
            <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">{formattedTime}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p className="text-muted-foreground">
                    {event.participants} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''} registered
                  </p>
                </div>
              </div>
            </div>

            {event.status === 'upcoming' && (
              <div>
                {isParticipating ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Registered
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleParticipate}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Register for this event
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {event.organizer.logoUrl && (
                  <img 
                    src={event.organizer.logoUrl} 
                    alt={event.organizer.name} 
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div>
                <h3 className="font-medium">{event.organizer.name}</h3>
                <p className="text-sm text-muted-foreground">Organizer</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {event.organizer.description}
            </p>
            <Link to={`/clubs/${event.organizer.id}`}>
              <Button variant="outline" className="w-full">
                View Club Profile
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;
