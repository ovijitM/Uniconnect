
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface EventHeaderProps {
  title: string;
  description: string;
  category: string;
  status: string;
  organizerId: string;
  organizerName: string;
  tagline?: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  description,
  category,
  status,
  organizerId,
  organizerName,
  tagline
}) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    ongoing: 'bg-green-100 text-green-800 border-green-200',
    past: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <>
      <div className="mb-6">
        <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="capitalize">
            {category}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Organized by:{' '}
            <Link to={`/clubs/${organizerId}`} className="text-primary hover:underline">
              {organizerName}
            </Link>
          </div>
        </div>
        <h1 className="text-3xl font-semibold mb-2">{title}</h1>
        {tagline && (
          <p className="text-lg text-muted-foreground mb-4 italic">{tagline}</p>
        )}
        <p className="text-muted-foreground whitespace-pre-line">{description}</p>
      </div>
    </>
  );
};

export default EventHeader;
