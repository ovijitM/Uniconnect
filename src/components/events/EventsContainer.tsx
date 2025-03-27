
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types';
import EventsHeader from './EventsHeader';
import EventsList from './EventsList';
import EventsFilters from './EventsFilters';
import EventsEmptyState from './EventsEmptyState';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { fetchEvents } from '@/hooks/events/useEventsFetching';

const EventsContainer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // We'll fetch events based on user university if available
        const userUniversity = user?.university || null;
        const data = await fetchEvents(userUniversity);
        
        console.log("Fetched events:", data);
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load events',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user, toast]);

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

  // Extract all unique categories from events
  const categories = [...new Set(events.map(event => event.category))];

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log("Filtered events length:", filteredEvents.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <EventsHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        <div className="lg:col-span-1">
          <EventsFilters 
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            clearFilters={clearFilters}
          />
        </div>
        
        <div className="lg:col-span-3">
          {filteredEvents.length > 0 ? (
            <EventsList events={filteredEvents} />
          ) : (
            <EventsEmptyState clearFilters={clearFilters} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsContainer;
