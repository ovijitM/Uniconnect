
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

// Mock club data
const mockClubs: Record<string, Club> = {
  '101': {
    id: '101',
    name: 'Computer Science Society',
    description: 'A community for tech enthusiasts to collaborate, learn, and grow together through workshops, hackathons, and industry connections. The Computer Science Society aims to bridge the gap between academic theory and practical application, providing members with opportunities to develop technical skills, collaborate on projects, and connect with industry professionals.\n\nOur mission is to foster a supportive learning environment where students of all skill levels can explore their interests in computer science, software development, artificial intelligence, and other related fields. We regularly organize coding competitions, tech talks, and social events to build a strong community of future tech leaders.',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Technology',
    memberCount: 120,
    events: [
      {
        id: '1',
        title: 'Annual Tech Conference',
        description: 'Join us for a day of technology talks, workshops, and networking opportunities with industry professionals.',
        date: '2023-11-15T09:00:00',
        location: 'University Main Hall',
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        organizer: {
          id: '101',
          name: 'Computer Science Society',
          description: '',
          logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          category: 'Technology',
          memberCount: 120,
          events: []
        },
        category: 'Technology',
        status: 'upcoming',
        participants: 78,
        maxParticipants: 150
      },
      {
        id: '9',
        title: 'Web Development Workshop',
        description: 'Learn the fundamentals of web development with hands-on exercises in HTML, CSS, and JavaScript.',
        date: '2023-10-08T13:00:00',
        location: 'Computer Science Building, Room 201',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        organizer: {
          id: '101',
          name: 'Computer Science Society',
          description: '',
          logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          category: 'Technology',
          memberCount: 120,
          events: []
        },
        category: 'Technology',
        status: 'past',
        participants: 30,
        maxParticipants: 40
      },
      {
        id: '10',
        title: 'Artificial Intelligence Seminar',
        description: 'Explore the latest advancements in AI with guest speakers from leading research institutions.',
        date: '2023-12-10T15:00:00',
        location: 'Science Center, Lecture Hall A',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        organizer: {
          id: '101',
          name: 'Computer Science Society',
          description: '',
          logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
          category: 'Technology',
          memberCount: 120,
          events: []
        },
        category: 'Technology',
        status: 'upcoming',
        participants: 50,
        maxParticipants: 120
      }
    ]
  }
};

const ClubDetailPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const { isLoaded, currentSrc } = useLazyImage(club?.logoUrl || '');
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch the club data from an API
    setIsLoading(true);
    setTimeout(() => {
      if (clubId && mockClubs[clubId]) {
        setClub(mockClubs[clubId]);
      }
      setIsLoading(false);
    }, 500);
  }, [clubId]);

  const handleJoinClub = () => {
    setIsMember(true);
    toast({
      title: "Successfully joined!",
      description: `You're now a member of ${club?.name}`,
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

  const upcomingEvents = club.events.filter(event => event.status === 'upcoming');
  const pastEvents = club.events.filter(event => event.status === 'past');

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
                  <p className="text-muted-foreground">{club.events.length} total events</p>
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

          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-medium mb-4">Related Clubs</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                  <img 
                    src="https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                    alt="Entrepreneurship Society" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <Link to="/clubs/104" className="font-medium hover:text-primary">
                    Entrepreneurship Society
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                  <img 
                    src="https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                    alt="Debate Society" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <Link to="/clubs/106" className="font-medium hover:text-primary">
                    Debate Society
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubDetailPage;
