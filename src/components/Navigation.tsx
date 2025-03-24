
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Users, Calendar, Zap, School } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      <NavButton to="/" isActive={isActive('/')}>
        <Home className="h-4 w-4 mr-2" />
        Home
      </NavButton>
      <NavButton to="/clubs" isActive={isActive('/clubs')}>
        <Users className="h-4 w-4 mr-2" />
        Clubs
      </NavButton>
      <NavButton to="/events" isActive={isActive('/events')}>
        <Calendar className="h-4 w-4 mr-2" />
        Events
      </NavButton>
      <NavButton to="/universities" isActive={isActive('/universities')}>
        <School className="h-4 w-4 mr-2" />
        Universities
      </NavButton>
      <NavButton to="/trending" isActive={isActive('/trending')}>
        <Zap className="h-4 w-4 mr-2" />
        Trending
      </NavButton>
    </nav>
  );
};

interface NavButtonProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ to, isActive, children }) => {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        isActive ? "bg-primary/10" : "hover:bg-primary/5"
      )}
      asChild
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
};

export default Navigation;
