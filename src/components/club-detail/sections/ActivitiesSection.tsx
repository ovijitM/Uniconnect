
import React from 'react';

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
          <h4 className="font-medium text-sm mb-1">Regular Events</h4>
          <ul className="list-disc list-inside text-muted-foreground text-sm pl-2 space-y-1">
            {regularEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>
      )}
      
      {signatureEvents && signatureEvents.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Signature Events</h4>
          <ul className="list-disc list-inside text-muted-foreground text-sm pl-2 space-y-1">
            {signatureEvents.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
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
