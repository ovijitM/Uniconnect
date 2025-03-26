
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OrganizerCardProps {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  university?: string;
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({ id, name, logoUrl, description, university }) => {
  // Add stronger validation to ensure id is valid
  const validId = id && id !== 'undefined' && id !== 'null' ? id : null;
  
  // Log the ID to help with debugging
  console.log("OrganizerCard: rendering with club ID:", id, "isValid:", !!validId);
  
  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt={name} 
              className="object-cover w-full h-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/150?text=Club+Logo';
              }}
            />
          )}
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">Organizer</p>
          {university && (
            <p className="text-xs text-muted-foreground">{university}</p>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      {validId ? (
        <Link to={`/clubs/${validId}`}>
          <Button variant="outline" className="w-full">
            View Club Profile
          </Button>
        </Link>
      ) : (
        <Button variant="outline" className="w-full" disabled>
          Club Profile Unavailable
        </Button>
      )}
    </div>
  );
};

export default OrganizerCard;
