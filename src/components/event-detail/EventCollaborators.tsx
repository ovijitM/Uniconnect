
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Handshake } from 'lucide-react';
import { Club } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface EventCollaboratorsProps {
  collaborators?: Club[];
  organizer: Club;
}

const EventCollaborators: React.FC<EventCollaboratorsProps> = ({ collaborators, organizer }) => {
  if (!collaborators || collaborators.length === 0) return null;
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Handshake className="h-6 w-6 text-primary shrink-0 mt-1" />
          <div className="w-full">
            <h3 className="text-lg font-medium mb-4">Collaborating Clubs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {collaborators.map(club => (
                <Link 
                  key={club.id} 
                  to={`/clubs/${club.id}`}
                  className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={club.logoUrl || ''} alt={club.name} />
                    <AvatarFallback>{club.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{club.name}</h4>
                    <p className="text-xs text-muted-foreground">{club.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCollaborators;
