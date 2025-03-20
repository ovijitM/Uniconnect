
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

// Mock data for initial render
const mockEvents: Event[] = [
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
    id: '2',
    title: 'Spring Arts Festival',
    description: 'Celebrate creativity with performances, exhibitions, and interactive art installations from students and guest artists.',
    date: '2023-10-05T10:00:00',
    location: 'University Arts Center',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    organizer: {
      id: '102',
      name: 'Fine Arts Club',
      description: '',
      logoUrl: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'Arts',
      memberCount: 85,
      events: []
    },
    category: 'Arts',
    status: 'ongoing',
    participants: 150,
    maxParticipants: 200
  },
  {
    id: '3',
    title: 'Environmental Summit',
    description: 'Learn about sustainability initiatives and how you can contribute to a greener campus and community.',
    date: '2023-09-20T14:00:00',
    location: 'University Green Space',
    imageUrl: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    organizer: {
      id: '103',
      name: 'Environmental Action Group',
      description: '',
      logoUrl: 'https://images.unsplash.com/photo-1569163139500-66446e7725ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'Environment',
      memberCount: 65,
      events: []
    },
    category: 'Environment',
    status: 'past',
    participants: 112,
    maxParticipants: null
  },
  {
    id: '4',
    title: 'Entrepreneurship Workshop',
    description: 'Develop your business skills and learn from successful entrepreneurs in this interactive workshop.',
    date: '2023-11-25T13:00:00',
    location: 'Business School Auditorium',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    organizer: {
      id: '104',
      name: 'Entrepreneurship Society',
      description: '',
      logoUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'Business',
      memberCount: 95,
      events: []
    },
    category: 'Business',
    status: 'upcoming',
    participants: 45,
    maxParticipants: 100
  }
];

const mockClubs: Club[] = [
  {
    id: '101',
    name: 'Computer Science Society',
    description: 'A community for tech enthusiasts to collaborate, learn, and grow together through workshops, hackathons, and industry connections.',
    logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Technology',
    memberCount: 120,
    events: []
  },
  {
    id: '102',
    name: 'Fine Arts Club',
    description: 'Dedicated to promoting artistic expression and appreciation across various mediums, from painting and sculpture to digital art.',
    logoUrl: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Arts',
    memberCount: 85,
    events: []
  },
  {
    id: '103',
    name: 'Environmental Action Group',
    description: 'Working towards a sustainable campus and community through education, advocacy, and hands-on conservation projects.',
    logoUrl: 'https://images.unsplash.com/photo-1569163139500-66446e7725ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Environment',
    memberCount: 65,
    events: []
  },
  {
    id: '104',
    name: 'Entrepreneurship Society',
    description: 'Fostering innovation and business acumen through mentorship, networking events, and startup competitions.',
    logoUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Business',
    memberCount: 95,
    events: []
  }
];

const Index: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);

  useEffect(() => {
    // In a real app, you would fetch data from an API
    setTimeout(() => {
      setEvents(mockEvents);
      setClubs(mockClubs);
      setFeaturedEvent(mockEvents[0]);
    }, 300);
  }, []);

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

        {featuredEvent && (
          <div className="mb-12">
            <FeaturedEvent event={featuredEvent} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter(event => event.status === 'upcoming')
              .slice(0, 3)
              .map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.slice(0, 4).map((club, index) => (
              <ClubCard key={club.id} club={club} index={index} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
