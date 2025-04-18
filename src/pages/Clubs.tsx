import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Layout from '@/components/Layout';
import ClubCard from '@/components/ClubCard';
import { Club, University } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UniversityFilter from '@/components/UniversityFilter';

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUniversities() {
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Transform data to match the University type
        const transformedData: University[] = data?.map(uni => ({
          id: uni.id,
          name: uni.name,
          logoUrl: uni.logo_url,
          description: uni.description,
          createdAt: uni.created_at
        })) || [];
        
        setUniversities(transformedData);
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: 'Error fetching universities',
          description: 'Failed to load university list',
          variant: 'destructive',
        });
      }
    }

    fetchUniversities();
  }, [toast]);

  useEffect(() => {
    async function fetchClubs() {
      try {
        setIsLoading(true);
        
        // Fetch clubs from Supabase - only approved clubs
        let query = supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            tagline,
            established_year,
            university,
            club_members(count)
          `)
          .eq('status', 'approved');  // Only fetch approved clubs
        
        // Filter by university if selected
        if (selectedUniversity) {
          query = query.eq('university', selectedUniversity);
        }
        
        const { data, error } = await query.order('name');
        
        if (error) {
          throw error;
        }
        
        // Transform data to match the Club type
        const clubsData = data.map(club => ({
          id: club.id,
          name: club.name,
          description: club.description,
          logoUrl: club.logo_url,
          category: club.category,
          tagline: club.tagline,
          establishedYear: club.established_year,
          university: club.university,
          memberCount: club.club_members[0]?.count || 0,
          events: [] // We'll fetch events separately if needed
        }));
        
        setClubs(clubsData);
        
        // Extract unique categories
        if (clubsData.length > 0) {
          const uniqueCategories = Array.from(new Set(clubsData.map(club => club.category)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
        toast({
          title: 'Error fetching clubs',
          description: 'Failed to load clubs. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchClubs();
  }, [toast, selectedUniversity]);

  useEffect(() => {
    // Filter clubs based on search and categories
    let filtered = [...clubs];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (club.university && club.university.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(club => selectedCategories.includes(club.category));
    }
    
    setFilteredClubs(filtered);
  }, [clubs, searchTerm, selectedCategories]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedUniversity(null);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-8"
      >
        <h1 className="text-3xl font-medium mb-2">University Clubs</h1>
        <p className="text-muted-foreground">
          Discover clubs and organizations that match your interests.
        </p>
      </motion.div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search clubs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={clearFilters}
            disabled={!searchTerm && selectedCategories.length === 0 && !selectedUniversity}
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
        
        <UniversityFilter
          universities={universities}
          selectedUniversity={selectedUniversity}
          onSelect={setSelectedUniversity}
          isLoading={isLoading}
          className="mb-4"
        />
        
        <div className="flex flex-wrap gap-2">
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
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
      ) : filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredClubs.map((club, index) => (
            <ClubCard key={club.id} club={club} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No clubs found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria.</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </Layout>
  );
};

export default ClubsPage;
