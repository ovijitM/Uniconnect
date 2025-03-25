import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, Calendar, School } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Logo />
          
          <div className="hidden md:flex items-center space-x-1 ml-6">
            <NavLink to="/" isActive={isActive('/')}>
              <Home className="h-4 w-4 mr-1" />
              Home
            </NavLink>
            <NavLink to="/clubs" isActive={isActive('/clubs')}>
              <Users className="h-4 w-4 mr-1" />
              Clubs
            </NavLink>
            <NavLink to="/events" isActive={isActive('/events')}>
              <Calendar className="h-4 w-4 mr-1" />
              Events
            </NavLink>
            <NavLink to="/universities" isActive={isActive('/universities')}>
              <School className="h-4 w-4 mr-1" />
              Universities
            </NavLink>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {user ? (
            <UserProfile />
          ) : (
            <div className="hidden md:block">
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            className="block md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu-container">
          <div className="container py-2 pb-4 flex flex-col space-y-2">
            <MobileNavLink to="/" isActive={isActive('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </MobileNavLink>
            <MobileNavLink to="/clubs" isActive={isActive('/clubs')}>
              <Users className="h-4 w-4 mr-2" />
              Clubs
            </MobileNavLink>
            <MobileNavLink to="/events" isActive={isActive('/events')}>
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </MobileNavLink>
            <MobileNavLink to="/universities" isActive={isActive('/universities')}>
              <School className="h-4 w-4 mr-2" />
              Universities
            </MobileNavLink>
            
            {!user && (
              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
