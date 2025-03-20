
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import Layout from '@/components/Layout';
import EventCard from '@/components/EventCard';
import { Event, EventStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
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
  },
  {
    id: '5',
    title: 'Cultural Diversity Fair',
    description: 'Experience cultures from around the world through food, performances, and interactive exhibits.',
    date: '2023-10-18T11:00:00',
    location: 'University Plaza',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    organizer: {
      id: '105',
      name: 'International Students Association',
      description: '',
      logoUrl: 'https://images.unsplash.com/photo-1516589178581-883abab07551?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'Culture',
      memberCount: 130,
      events: []
    },
    category: 'Culture',
    status: 'ongoing',
    participants: 200,
    maxParticipants: 300
  },
  {
    id: '6',
    title: 'Debate Championship',
    description: 'Watch top debaters compete on contemporary social, political, and philosophical issues.',
    date: '2023-09-10T15:00:00',
    location: 'Law School Moot Court',
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    organizer: {
      id: '106',
      name: 'Debate Society',
      description: '',
      logoUrl: 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      category: 'Academic',
      memberCount: 55,
      events: []
    },
    category: 'Academic',
    status: 'past',
    participants: 80,
    maxParticipants: 100
  }
];

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    // In a real app, fetch events from an API
    setTimeout(() => {
      setEvents(mockEvents);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(mockEvents.map(event => event.category)));
      setCategories(uniqueCategories);
    }, 300);
  }, []);

  useEffect(() => {
    // Filter events based on search, status, and categories
    let filtered = [...events];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event => selectedCategories.includes(event.category));
    }
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedStatus, selectedCategories]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedCategories([]);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-8"
      >
        <h1 className="text-3xl font-medium mb-2">University Events</h1>
        <p className="text-muted-foreground">
          Browse and discover events organized by university clubs.
        </p>
      </motion.div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={clearFilters}
            disabled={!searchTerm && selectedStatus === 'all' && selectedCategories.length === 0}
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setSelectedStatus(value as EventStatus | 'all')}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria.</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </Layout>
  );
};

export default EventsPage;
