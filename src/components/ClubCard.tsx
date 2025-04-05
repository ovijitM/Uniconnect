
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, CalendarDays } from 'lucide-react';
import { Club } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClubCardProps {
  club: Club;
  index?: number;
  onJoin?: (clubId: string) => Promise<void>;
  isJoined?: boolean;
  size?: 'default' | 'compact';
}

const ClubCard: React.FC<ClubCardProps> = ({ 
  club, 
  index = 0,
  onJoin,
  isJoined = false,
  size = 'default'
}) => {
  console.log("ClubCard rendering with club ID:", club.id, "Club name:", club.name, "isJoined:", isJoined);
  
  // Enhanced validation for club ID
  const hasValidId = Boolean(club.id) && 
                    typeof club.id === 'string' && 
                    club.id !== 'undefined' && 
                    club.id !== 'null';
  
  if (!hasValidId) {
    console.warn(`Invalid club ID for "${club.name}": ${String(club.id)}`);
  }

  const isCompact = size === 'compact';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "rounded-lg overflow-hidden bg-card border shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col",
        isCompact && "shadow-none"
      )}
    >
      <div className={cn("relative", isCompact ? "h-28 sm:h-36" : "h-36 sm:h-48")}>
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
      
      <div className={cn("p-4 flex-1 flex flex-col", isCompact && "p-3")}>
        {hasValidId ? (
          <Link 
            to={`/clubs/${club.id}`} 
            className="block hover:text-primary transition-colors"
            onClick={() => console.log("Navigating to club detail:", `/clubs/${club.id}`)}
          >
            <h3 className={cn(
              "font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1",
              isCompact && "text-base"
            )}>
              {club.name}
            </h3>
          </Link>
        ) : (
          <h3 className={cn(
            "font-semibold text-lg mb-1 text-muted-foreground line-clamp-1",
            isCompact && "text-base"
          )}>
            {club.name}
          </h3>
        )}
        
        <p className={cn(
          "text-muted-foreground text-sm mb-3 line-clamp-2",
          isCompact ? "h-8 text-xs" : "h-10"
        )}>
          {club.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 mt-auto">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{club.memberCount || 0} members</span>
          </div>
          
          {club.university && (
            <div className="flex items-center gap-1 max-w-[50%] truncate">
              <span className="truncate">{club.university}</span>
            </div>
          )}
        </div>

        {onJoin && (
          <div className="mt-2">
            <Button 
              onClick={() => onJoin(club.id)} 
              disabled={isJoined}
              variant={isJoined ? "outline" : "default"}
              size={isCompact ? "sm" : "sm"}
              className={cn("w-full", isJoined && "bg-green-50")}
            >
              {isJoined ? "Joined" : "Join Club"}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClubCard;
