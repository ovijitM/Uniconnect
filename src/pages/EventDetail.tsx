
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipating, setIsParticipating] = useState(false);
  const { isLoaded, currentSrc } = useLazyImage(event?.imageUrl || '');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchEventData() {
      if (!eventId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            date,
            location,
            image_url,
            category,
            status,
            max_participants,
            club_id,
            event_participants(count)
          `)
          .eq('id', eventId)
          .single();
        
        if (eventError) throw eventError;
        
        // Fetch club details
        const { data: clubData, error: clubError } = await supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            club_members(count)
          `)
          .eq('id', eventData.club_id)
          .single();
        
        if (clubError) throw clubError;
        
        // Check if current user is a participant
        if (user) {
          const { data: participationData, error: participationError } = await supabase
            .from('event_participants')
            .select('*')
            .eq('event_id', eventId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          setIsParticipating(!!participationData);
          
          if (participationError) {
            console.error('Error checking participation:', participationError);
          }
        }
        
        // Format the event data
        const formattedEvent: Event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
          imageUrl: eventData.image_url,
          category: eventData.category,
          status: eventData.status,
          participants: eventData.event_participants[0]?.count || 0,
          maxParticipants: eventData.max_participants || undefined,
          organizer: {
            id: clubData.id,
            name: clubData.name,
            description: clubData.description,
            logoUrl: clubData.logo_url,
            category: clubData.category,
            memberCount: clubData.club_members[0]?.count || 0,
            events: []
          }
        };
        
        setEvent(formattedEvent);
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast({
          title: 'Error fetching event',
          description: 'Failed to load event details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEventData();
  }, [eventId, toast, user]);

  const handleParticipate = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to join events",
          variant: "destructive",
        });
        return;
      }
      
      if (!eventId) return;
      
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id
        });
      
      if (error) throw error;
      
      setIsParticipating(true);
      setEvent(prev => prev ? { ...prev, participants: prev.participants + 1 } : null);
      
      toast({
        title: "Successfully registered!",
        description: `You've joined the ${event?.title}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: "Failed to register",
        description: "There was an error joining the event. Please try again later.",
        variant: "destructive",
      });
    }
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
