
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, CalendarDays } from 'lucide-react';
import { Club } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ClubCardProps {
  club: Club;
  index: number;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, index }) => {
  console.log("ClubCard rendering with club ID:", club.id);
  
  // Validate club ID
  const hasValidId = club.id && club.id !== 'undefined' && club.id !== 'null';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-lg overflow-hidden bg-card border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="h-48 relative">
        {club.logoUrl ? (
          <img
            src={club.logoUrl}
            alt={club.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/150?text=Club+Logo';
            }}
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
            <span className="text-2xl font-semibold text-primary/50">
              {club.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <Badge className="absolute bottom-2 left-2">
          {club.category}
        </Badge>
      </div>
      
      <div className="p-4">
        <Link to={hasValidId ? `/clubs/${club.id}` : "#"} className={`block ${!hasValidId ? 'pointer-events-none' : ''}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
            {club.name}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 h-10">
          {club.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{club.memberCount || 0} members</span>
          </div>
          
          {club.university && (
            <div className="flex items-center gap-1">
              <span>{club.university}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClubCard;
