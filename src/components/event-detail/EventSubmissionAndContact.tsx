
import React from 'react';
import { FileText, Mail, Share2, Hash, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EventSubmissionAndContactProps {
  deliverables?: string[];
  submissionPlatform?: string;
  mentors?: string[];
  sponsors?: string[];
  contactEmail?: string;
  communityLink?: string;
  eventWebsite?: string;
  eventHashtag?: string;
}

const EventSubmissionAndContact: React.FC<EventSubmissionAndContactProps> = ({
  deliverables,
  submissionPlatform,
  mentors,
  sponsors,
  contactEmail,
  communityLink,
  eventWebsite,
  eventHashtag
}) => {
  // Check if we have any data to display
  const hasData = (deliverables && deliverables.length > 0) || 
                 submissionPlatform ||
                 (mentors && mentors.length > 0) ||
                 (sponsors && sponsors.length > 0) ||
                 contactEmail ||
                 communityLink ||
                 eventWebsite ||
                 eventHashtag;
                 
  if (!hasData) return null;

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6 mt-6">
      <h3 className="text-xl font-semibold">Submission & Contact</h3>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {((deliverables && deliverables.length > 0) || submissionPlatform) && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Submission Guidelines</h4>
                
                {deliverables && deliverables.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Deliverables</h5>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-muted-foreground">
                      {deliverables.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {submissionPlatform && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Submission Platform</h5>
                    <p className="text-muted-foreground">{submissionPlatform}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(mentors && mentors.length > 0) && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Mentors</h4>
                <p className="text-muted-foreground">{mentors.join(', ')}</p>
              </div>
            </div>
          )}
          
          {(sponsors && sponsors.length > 0) && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Sponsors & Partners</h4>
                <p className="text-muted-foreground">{sponsors.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {contactEmail && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Contact Email</h4>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          )}
          
          {communityLink && (
            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Community Link</h4>
                <a 
                  href={communityLink.startsWith('http') ? communityLink : `https://${communityLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Join Community
                </a>
              </div>
            </div>
          )}
          
          {eventWebsite && (
            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Event Website</h4>
                <a 
                  href={eventWebsite.startsWith('http') ? eventWebsite : `https://${eventWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            </div>
          )}
          
          {eventHashtag && (
            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Event Hashtag</h4>
                <p className="text-muted-foreground">{eventHashtag}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventSubmissionAndContact;
