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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        
        let userUniversity = null;
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('university')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            userUniversity = profileData.university;
          }
        }
        
        let eventsQuery = supabase
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
            visibility,
            event_participants(count)
          `);
          
        if (user && userUniversity) {
          eventsQuery = eventsQuery.or(`visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq.${userUniversity})`);
        } else {
          eventsQuery = eventsQuery.eq('visibility', 'public');
        }
        
        const { data: eventsData, error: eventsError } = await eventsQuery.order('date');
        
        if (eventsError) throw eventsError;
        
        const eventsWithOrganizers = await Promise.all(
          eventsData.map(async (event) => {
            const { data: clubData } = await supabase
              .from('clubs')
              .select(`
                id,
                name,
                description,
                logo_url,
                category,
                university,
                club_members(count)
              `)
              .eq('id', event.club_id)
              .single();
            
            return {
              id: event.id,
              title: event.title,
              description: event.description,
              date: event.date,
              location: event.location,
              imageUrl: event.image_url,
              category: event.category,
              status: (event.status || 'upcoming') as EventStatus,
              visibility: (event.visibility || 'public') as 'public' | 'university_only',
              participants: event.event_participants[0]?.count || 0,
              maxParticipants: event.max_participants || undefined,
              organizer: {
                id: clubData.id,
                name: clubData.name,
                description: clubData.description,
                logoUrl: clubData.logo_url,
                category: clubData.category,
                university: clubData.university,
                memberCount: clubData.club_members[0]?.count || 0,
                events: []
              }
            };
          })
        );
        
        setEvents(eventsWithOrganizers);
        
        if (eventsWithOrganizers.length > 0) {
          const uniqueCategories = Array.from(new Set(eventsWithOrganizers.map(event => event.category)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Error fetching events',
          description: 'Failed to load events. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEvents();
  }, [toast, user]);

  useEffect(() => {
    let filtered = [...events];
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }
    
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3 border border-t-0 rounded-b-lg">
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
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
