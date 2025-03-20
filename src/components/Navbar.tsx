
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Calendar, Users, Home, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './UserProfile';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Clubs', path: '/clubs', icon: Users },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'glass-panel py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold">UniEvents</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive ? "secondary" : "ghost"} 
                  className={`relative px-4 py-2 text-sm transition-all duration-300 ${
                    isActive ? 'font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                  {isActive && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" 
                      layoutId="navbar-indicator"
                    />
                  )}
                </Button>
              </Link>
            );
          })}

          {/* Authentication buttons or user profile */}
          <div className="ml-4 flex items-center space-x-2">
            {user ? (
              <UserProfile />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="hidden sm:flex">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {user && <UserProfile />}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden glass-panel px-4 pb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    className={`w-full justify-start ${
                      isActive ? 'font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            
            {/* Authentication buttons for mobile */}
            {!user && (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    className="w-full justify-start"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
