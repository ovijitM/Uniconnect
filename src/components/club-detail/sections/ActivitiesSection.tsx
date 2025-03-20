
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ActivitiesSectionProps {
  regularEvents?: string[];
  signatureEvents?: string[];
  communityEngagement?: string;
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  regularEvents,
  signatureEvents,
  communityEngagement
}) => {
  const hasContent = 
    (regularEvents && regularEvents.length > 0) || 
    (signatureEvents && signatureEvents.length > 0) || 
    communityEngagement;
    
  if (!hasContent) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Activities & Events</h3>
      
      {regularEvents && regularEvents.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Regular Events</h4>
          <div className="flex flex-wrap gap-2">
            {regularEvents.map((event, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {event}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {signatureEvents && signatureEvents.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Signature Events</h4>
          <div className="flex flex-wrap gap-2">
            {signatureEvents.map((event, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1 border-primary/30 bg-primary/5">
                {event}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {communityEngagement && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Community Engagement</h4>
          <p className="text-sm text-muted-foreground">{communityEngagement}</p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesSection;
