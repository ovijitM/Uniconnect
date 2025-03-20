
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Layout from '@/components/Layout';
import ClubCard from '@/components/ClubCard';
import { Club } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data
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
  },
  {
    id: '105',
    name: 'International Students Association',
    description: 'Promoting cultural exchange and supporting international students in their academic and social integration.',
    logoUrl: 'https://images.unsplash.com/photo-1516589178581-883abab07551?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Culture',
    memberCount: 130,
    events: []
  },
  {
    id: '106',
    name: 'Debate Society',
    description: 'Fostering critical thinking and public speaking skills through competitive and casual debate sessions.',
    logoUrl: 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Academic',
    memberCount: 55,
    events: []
  },
  {
    id: '107',
    name: 'Sports Federation',
    description: 'Coordinating university sports activities and promoting physical fitness among students.',
    logoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Sports',
    memberCount: 180,
    events: []
  },
  {
    id: '108',
    name: 'Literary Society',
    description: 'Celebrating literature through book clubs, writing workshops, and poetry nights.',
    logoUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    category: 'Literature',
    memberCount: 70,
    events: []
  }
];

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);

  useEffect(() => {
    // In a real app, fetch clubs from an API
    setTimeout(() => {
      setClubs(mockClubs);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(mockClubs.map(club => club.category)));
      setCategories(uniqueCategories);
    }, 300);
  }, []);

  useEffect(() => {
    // Filter clubs based on search and categories
    let filtered = [...clubs];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            disabled={!searchTerm && selectedCategories.length === 0}
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
        
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

      {filteredClubs.length > 0 ? (
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
