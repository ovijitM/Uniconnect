
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Users, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/clubs?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative py-12 md:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30"></div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          >
            Connect, Collaborate, Create with University Clubs
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl px-4"
          >
            Discover exciting events, join thriving communities, and make the most of your university experience through campus clubs and organizations.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mb-6 md:mb-8 px-4"
            onSubmit={handleSearch}
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search for events, clubs, or activities..." 
                className="pl-10 pr-10 h-12 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" className="h-12 whitespace-nowrap">
              Find Events
            </Button>
          </motion.form>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 md:mb-8"
          >
            <Link to="/events" className="flex items-center hover:text-primary transition-colors">
              <Calendar className="text-primary mr-2 h-5 w-5" />
              <span>Upcoming Events</span>
            </Link>
            <Link to="/clubs" className="flex items-center hover:text-primary transition-colors">
              <Users className="text-primary mr-2 h-5 w-5" />
              <span>Active Clubs</span>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/events">
              <Button size="lg" className="group w-full sm:w-auto">
                Browse Events
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/clubs">
              <Button variant="outline" size="lg" className="group w-full sm:w-auto">
                Explore Clubs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
