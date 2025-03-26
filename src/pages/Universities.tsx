import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Building, ExternalLink } from 'lucide-react';
import Layout from '@/components/Layout';
import { University } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UniversitiesPage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUniversities() {
      try {
        setIsLoading(true);
        
        // Get the universities
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
        setFilteredUniversities(transformedData);
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: 'Error fetching universities',
          description: 'Failed to load universities. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUniversities();
  }, [toast]);

  useEffect(() => {
    // Filter universities based on search
    if (searchTerm) {
      const filtered = universities.filter(university => 
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (university.description && university.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUniversities(filtered);
    } else {
      setFilteredUniversities(universities);
    }
  }, [universities, searchTerm]);

  const handleUniversityClick = (universityName: string) => {
    navigate(`/clubs?university=${encodeURIComponent(universityName)}`);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-8"
      >
        <h1 className="text-3xl font-medium mb-2">Universities</h1>
        <p className="text-muted-foreground">
          Browse universities and discover their clubs and events.
        </p>
      </motion.div>

      <div className="mb-8">
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search universities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredUniversities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredUniversities.map((university, index) => (
            <motion.div
              key={university.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-4">
                    {university.logoUrl ? (
                      <img 
                        src={university.logoUrl} 
                        alt={university.name} 
                        className="h-16 w-16 object-contain"
                      />
                    ) : (
                      <Building className="h-16 w-16 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-medium text-center mb-2">{university.name}</h3>
                  {university.description && (
                    <p className="text-sm text-muted-foreground text-center line-clamp-3">
                      {university.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                  <Button onClick={() => handleUniversityClick(university.name)}>
                    View Clubs <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No universities found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search criteria.</p>
          <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
        </div>
      )}
    </Layout>
  );
};

export default UniversitiesPage;
