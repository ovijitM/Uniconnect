
import React from 'react';
import { Club } from '@/types';
import { Users, Calendar, Link as LinkIcon, Facebook, Instagram, Twitter, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ClubDetailInfoProps {
  club: Club;
}

const ClubDetailInfo: React.FC<ClubDetailInfoProps> = ({ club }) => {
  return (
    <div className="mt-6 space-y-6">
      {club.whyJoin && (
        <div>
          <h3 className="text-lg font-medium mb-2">Why Join?</h3>
          <p className="text-muted-foreground whitespace-pre-line">{club.whyJoin}</p>
        </div>
      )}
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Activities & Events</h3>
          {club.regularEvents && club.regularEvents.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">Regular Events</h4>
              <ul className="list-disc list-inside text-muted-foreground text-sm pl-2 space-y-1">
                {club.regularEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>
          )}
          
          {club.signatureEvents && club.signatureEvents.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">Signature Events</h4>
              <ul className="list-disc list-inside text-muted-foreground text-sm pl-2 space-y-1">
                {club.signatureEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>
          )}
          
          {club.communityEngagement && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">Community Engagement</h4>
              <p className="text-sm text-muted-foreground">{club.communityEngagement}</p>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Membership Details</h3>
          {club.whoCanJoin && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">Who Can Join?</h4>
              <p className="text-sm text-muted-foreground">{club.whoCanJoin}</p>
            </div>
          )}
          
          {club.membershipFee && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">Membership Fee</h4>
              <p className="text-sm text-muted-foreground">{club.membershipFee}</p>
            </div>
          )}
          
          {club.howToJoin && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">How to Join</h4>
              <p className="text-sm text-muted-foreground">{club.howToJoin}</p>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Leadership & Team</h3>
          {club.presidentName && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">President/Founder</h4>
              <p className="text-sm text-muted-foreground">{club.presidentName}</p>
              {club.presidentContact && (
                <p className="text-sm text-muted-foreground">{club.presidentContact}</p>
              )}
            </div>
          )}
          
          {club.executiveMembers && Object.keys(club.executiveMembers).length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">Executive Members</h4>
              <div className="text-sm text-muted-foreground">
                {Object.entries(club.executiveMembers).map(([role, name], index) => (
                  <div key={index} className="flex">
                    <span className="font-medium min-w-32">{role}:</span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {club.advisors && club.advisors.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-1">Advisors/Mentors</h4>
              <ul className="list-disc list-inside text-muted-foreground text-sm pl-2 space-y-1">
                {club.advisors.map((advisor, index) => (
                  <li key={index}>{advisor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Contact & Social Media</h3>
          <div className="flex flex-col gap-2">
            {club.phoneNumber && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                <a href={`tel:${club.phoneNumber}`} className="hover:text-primary">
                  {club.phoneNumber}
                </a>
              </div>
            )}
            
            {club.website && (
              <div className="flex items-center text-sm text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2" />
                <a 
                  href={club.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary truncate"
                >
                  {club.website}
                </a>
              </div>
            )}
            
            {club.facebookLink && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Facebook className="w-4 h-4 mr-2" />
                <a 
                  href={club.facebookLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Facebook
                </a>
              </div>
            )}
            
            {club.instagramLink && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Instagram className="w-4 h-4 mr-2" />
                <a 
                  href={club.instagramLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Instagram
                </a>
              </div>
            )}
            
            {club.twitterLink && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Twitter className="w-4 h-4 mr-2" />
                <a 
                  href={club.twitterLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Twitter
                </a>
              </div>
            )}
            
            {club.discordLink && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MessageSquare className="w-4 h-4 mr-2" />
                <a 
                  href={club.discordLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Discord
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailInfo;
