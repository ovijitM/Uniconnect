
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, Mail, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import { Club, Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLazyImage } from '@/utils/animations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ClubDetailPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [relatedClubs, setRelatedClubs] = useState<Club[]>([]);
  const { isLoaded, currentSrc } = useLazyImage(club?.logoUrl || '');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchClubData() {
      if (!clubId) return;
      
      try {
        setIsLoading(true);
        
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
          .eq('id', clubId)
          .single();
        
        if (clubError) throw clubError;
        
        // Fetch events for this club
        const { data: eventsData, error: eventsError } = await supabase
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
            event_participants(count)
          `)
          .eq('club_id', clubId)
          .order('date');
        
        if (eventsError) throw eventsError;
        
        // Check if current user is a member
        if (user) {
          const { data: membershipData, error: membershipError } = await supabase
            .from('club_members')
            .select('*')
            .eq('club_id', clubId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          setIsMember(!!membershipData);
          
          if (membershipError) {
            console.error('Error checking membership:', membershipError);
          }
        }
        
        // Fetch related clubs (same category)
        const { data: relatedData, error: relatedError } = await supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            club_members(count)
          `)
          .eq('category', clubData.category)
          .neq('id', clubId)
          .limit(3);
        
        if (relatedError) {
          console.error('Error fetching related clubs:', relatedError);
        } else {
          const formattedRelatedClubs = relatedData.map(club => ({
            id: club.id,
            name: club.name,
            description: club.description,
            logoUrl: club.logo_url,
            category: club.category,
            memberCount: club.club_members[0]?.count || 0,
            events: []
          }));
          setRelatedClubs(formattedRelatedClubs);
        }
        
        // Format the club data
        const formattedClub: Club = {
          id: clubData.id,
          name: clubData.name,
          description: clubData.description,
          logoUrl: clubData.logo_url,
          category: clubData.category,
          memberCount: clubData.club_members[0]?.count || 0,
          events: []
        };
        
        // Format the events data
        const formattedEvents: Event[] = eventsData.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          imageUrl: event.image_url,
          organizer: formattedClub,
          category: event.category,
          status: event.status,
          participants: event.event_participants[0]?.count || 0,
          maxParticipants: event.max_participants || undefined
        }));
        
        setClub(formattedClub);
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching club data:', error);
        toast({
          title: 'Error fetching club data',
          description: 'Failed to load club details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchClubData();
  }, [clubId, toast, user]);

  const handleJoinClub = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to join clubs",
          variant: "destructive",
        });
        return;
      }
      
      if (!clubId) return;
      
      const { error } = await supabase
        .from('club_members')
        .insert({
          club_id: clubId,
          user_id: user.id
        });
      
      if (error) throw error;
      
      setIsMember(true);
      setClub(prev => prev ? { ...prev, memberCount: prev.memberCount + 1 } : null);
      
      toast({
        title: "Successfully joined!",
        description: `You're now a member of ${club?.name}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error joining club:', error);
      toast({
        title: "Failed to join club",
        description: "There was an error joining the club. Please try again later.",
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

  if (!club) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Club not found</h2>
          <p className="text-muted-foreground mb-6">
            The club you're looking for might have been removed or doesn't exist.
          </p>
          <Link to="/clubs">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clubs
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'past');

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/clubs" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clubs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              <div 
                className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
                  isLoaded ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {currentSrc && (
                <img 
                  src={currentSrc} 
                  alt={club.name} 
                  className="object-contain w-full h-full p-2"
                />
              )}
            </div>
            <div>
              <div className="mb-2">
                <Badge variant="outline" className="capitalize">
                  {club.category}
                </Badge>
              </div>
              <h1 className="text-3xl font-semibold mb-2">{club.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                {club.memberCount} members
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-medium mb-4">About</h2>
            <p className="text-muted-foreground whitespace-pre-line">{club.description}</p>
          </div>

          <div>
            <Tabs defaultValue="upcoming" className="mb-6">
              <TabsList className="grid w-full max-w-xs grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="mt-6">
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground">
                      Check back later for new events from this club.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="past" className="mt-6">
                {pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastEvents.map((event, index) => (
                      <EventCard key={event.id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No past events</h3>
                    <p className="text-muted-foreground">
                      This club hasn't organized any events yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="glass-panel rounded-xl p-6">
            {isMember ? (
              <Button className="w-full mb-4" variant="outline" disabled>
                <Users className="mr-2 h-4 w-4" />
                You are a member
              </Button>
            ) : (
              <Button className="w-full mb-4" onClick={handleJoinClub}>
                <Users className="mr-2 h-4 w-4" />
                Join Club
              </Button>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Events</p>
                  <p className="text-muted-foreground">{events.length} total events</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-muted-foreground">{club.name.toLowerCase().replace(/\s+/g, '')}@university.edu</p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t">
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Website
              </Button>
            </div>
          </div>

          {relatedClubs.length > 0 && (
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-medium mb-4">Related Clubs</h3>
              <div className="space-y-4">
                {relatedClubs.map(relatedClub => (
                  <div key={relatedClub.id} className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                      <img 
                        src={relatedClub.logoUrl || "https://images.unsplash.com/photo-1493612276216-ee3925520721"} 
                        alt={relatedClub.name} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <Link to={`/clubs/${relatedClub.id}`} className="font-medium hover:text-primary">
                        {relatedClub.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubDetailPage;
