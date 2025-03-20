
import React from 'react';
import { Calendar, Clock, MapPin, Users, Globe, Tag, Bookmark, DollarSign, Award, Link2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EventInfoProps {
  date: string;
  location: string;
  participants: number;
  maxParticipants?: number;
  eventType?: string;
  onlinePlatform?: string;
  registrationDeadline?: string;
  registrationLink?: string;
  entryFee?: string;
  teamSize?: string;
  eligibility?: string;
}

const EventInfo: React.FC<EventInfoProps> = ({ 
  date, 
  location, 
  participants, 
  maxParticipants,
  eventType,
  onlinePlatform,
  registrationDeadline,
  registrationLink,
  entryFee,
  teamSize,
  eligibility
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    return new Date(deadline).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formattedEventType = eventType ? (
    eventType === 'in-person' ? 'In-person' : 
    eventType === 'online' ? 'Online' : 
    eventType === 'hybrid' ? 'Hybrid' : 
    eventType
  ) : 'Not specified';

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold">Event Information</h3>
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-start">
          <Calendar className="w-5 h-5 mr-3 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Clock className="w-5 h-5 mr-3 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Time</p>
            <p className="text-muted-foreground">{formattedTime}</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">{location}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Tag className="w-5 h-5 mr-3 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Event Type</p>
            <p className="text-muted-foreground capitalize">{formattedEventType}</p>
          </div>
        </div>
        
        {onlinePlatform && (
          <div className="flex items-start">
            <Globe className="w-5 h-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Online Platform</p>
              <p className="text-muted-foreground">{onlinePlatform}</p>
            </div>
          </div>
        )}
        
        {registrationDeadline && (
          <div className="flex items-start">
            <Bookmark className="w-5 h-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Registration Deadline</p>
              <p className="text-muted-foreground">{formatDeadline(registrationDeadline)}</p>
            </div>
          </div>
        )}
        
        {registrationLink && (
          <div className="flex items-start">
            <Link2 className="w-5 h-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Registration Link</p>
              <a 
                href={registrationLink.startsWith('http') ? registrationLink : `https://${registrationLink}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Register Here
              </a>
            </div>
          </div>
        )}
        
        {entryFee && (
          <div className="flex items-start">
            <DollarSign className="w-5 h-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Entry Fee</p>
              <p className="text-muted-foreground">{entryFee}</p>
            </div>
          </div>
        )}
        
        {teamSize && (
          <div className="flex items-start">
            <Users className="w-5 h-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Team Size</p>
              <p className="text-muted-foreground">{teamSize}</p>
            </div>
          </div>
        )}
        
        {eligibility && (
          <div className="flex items-start">
            <Award className="w-5 h-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Eligibility</p>
              <p className="text-muted-foreground">{eligibility}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start">
          <Users className="w-5 h-5 mr-3 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Participants</p>
            <p className="text-muted-foreground">
              {participants} {maxParticipants ? `/ ${maxParticipants}` : ''} registered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
