
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import FeaturedEvent from '@/components/FeaturedEvent';
import EventCard from '@/components/EventCard';
import ClubCard from '@/components/ClubCard';
import { Button } from '@/components/ui/button';
import { Event, Club } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Index: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch clubs from Supabase with corrected count aggregation
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('*');
        
        if (clubsError) throw clubsError;
        
        // Get club members count for each club
        const clubsWithCounts = await Promise.all(
          clubsData.map(async (club) => {
            const { count, error: countError } = await supabase
              .from('club_members')
              .select('*', { count: 'exact', head: true })
              .eq('club_id', club.id);
            
            return {
              id: club.id,
              name: club.name,
              description: club.description,
              logoUrl: club.logo_url,
              category: club.category,
              memberCount: count || 0,
              events: []
            };
          })
        );
        
        // Fetch events from Supabase
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date');
        
        if (eventsError) throw eventsError;
        
        // Get participants count and club details for each event
        const eventsWithDetails = await Promise.all(
          eventsData.map(async (event) => {
            const { count: participantsCount } = await supabase
              .from('event_participants')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', event.id);
            
            const { data: clubData } = await supabase
              .from('clubs')
              .select('*')
              .eq('id', event.club_id)
              .single();
            
            // Get club member count
            const { count: memberCount } = await supabase
              .from('club_members')
              .select('*', { count: 'exact', head: true })
              .eq('club_id', clubData.id);
            
            return {
              id: event.id,
              title: event.title,
              description: event.description,
              date: event.date,
              location: event.location,
              imageUrl: event.image_url,
              category: event.category,
              status: event.status,
              participants: participantsCount || 0,
              maxParticipants: event.max_participants || undefined,
              organizer: {
                id: clubData.id,
                name: clubData.name,
                description: clubData.description,
                logoUrl: clubData.logo_url,
                category: clubData.category,
                memberCount: memberCount || 0,
                events: []
              }
            };
          })
        );
        
        setClubs(clubsWithCounts);
        setEvents(eventsWithDetails);
        
        // Set the featured event (first upcoming event)
        const upcomingEvents = eventsWithDetails.filter(event => event.status === 'upcoming');
        if (upcomingEvents.length > 0) {
          setFeaturedEvent(upcomingEvents[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error loading data',
          description: 'Failed to load content. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);

  return (
    <Layout>
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-balance font-semibold mb-4">
            <span className="relative">
              <span className="relative z-10">University Events & Collaborations</span>
              <span className="absolute bottom-0 left-0 h-3 w-full bg-blue-100 -z-10"></span>
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
            Discover and participate in exciting events organized by university clubs, or create your own for the community.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="mb-12">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : featuredEvent ? (
          <div className="mb-12">
            <FeaturedEvent event={featuredEvent} />
          </div>
        ) : (
          <div className="text-center py-8 mb-12 bg-secondary/30 rounded-xl">
            <h3 className="text-lg font-medium mb-2">No featured events</h3>
            <p className="text-muted-foreground">Check back later for featured events.</p>
          </div>
        )}

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">Upcoming Events</h2>
            <Link to="/events">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : events.filter(event => event.status === 'upcoming').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => event.status === 'upcoming')
                .slice(0, 3)
                .map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-secondary/30 rounded-xl">
              <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
              <p className="text-muted-foreground">Check back later for new events.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">Featured Clubs</h2>
            <Link to="/clubs">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {clubs.slice(0, 4).map((club, index) => (
                <ClubCard key={club.id} club={club} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-secondary/30 rounded-xl">
              <h3 className="text-lg font-medium mb-2">No clubs available</h3>
              <p className="text-muted-foreground">Check back later for new clubs.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
