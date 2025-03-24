
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, ExternalLink, School } from 'lucide-react';
import { Club } from '@/types';
import { useLazyImage } from '@/utils/animations';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ClubCardProps {
  club: Club;
  index?: number;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, index = 0 }) => {
  const { isLoaded, currentSrc } = useLazyImage(club.logoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <Card className="overflow-hidden h-full glass-card hover:shadow-lg transition-all duration-300">
        <div className="relative h-36 overflow-hidden bg-gray-50 flex items-center justify-center">
          <div 
            className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {currentSrc && (
            <img
              src={currentSrc}
              alt={club.name}
              className="object-contain w-full h-full p-2 transition-transform duration-700 ease-apple hover:scale-105"
            />
          )}
        </div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-medium line-clamp-1">{club.name}</h3>
            <Badge variant="outline" className="capitalize text-xs ml-1">
              {club.category}
            </Badge>
          </div>
          {club.tagline && (
            <p className="text-xs text-muted-foreground mb-1 italic line-clamp-1">{club.tagline}</p>
          )}
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{club.description}</p>
          {club.university && (
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <School className="w-3 h-3 mr-1" />
              {club.university}
            </div>
          )}
          {club.establishedYear && (
            <p className="text-xs text-muted-foreground mb-1">
              Est. {club.establishedYear}
            </p>
          )}
        </CardContent>
        <CardFooter className="px-3 pb-2 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              {club.memberCount}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {club.events.length}
            </div>
          </div>
          <Button size="sm" variant="ghost" asChild className="h-7 text-xs px-2">
            <Link to={`/clubs/${club.id}`} className="flex items-center">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ClubCard;
