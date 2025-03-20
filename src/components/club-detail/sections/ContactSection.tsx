
import React from 'react';
import { Facebook, Instagram, Twitter, MessageSquare, Phone as PhoneIcon, Link as LinkIcon } from 'lucide-react';

interface ContactSectionProps {
  phoneNumber?: string;
  website?: string;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  discordLink?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  phoneNumber,
  website,
  facebookLink,
  instagramLink,
  twitterLink,
  discordLink
}) => {
  const hasContent = phoneNumber || website || facebookLink || instagramLink || twitterLink || discordLink;
  
  if (!hasContent) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Contact & Social Media</h3>
      <div className="flex flex-col gap-2">
        {phoneNumber && (
          <div className="flex items-center text-sm text-muted-foreground">
            <PhoneIcon className="w-4 h-4 mr-2" />
            <a href={`tel:${phoneNumber}`} className="hover:text-primary">
              {phoneNumber}
            </a>
          </div>
        )}
        
        {website && (
          <div className="flex items-center text-sm text-muted-foreground">
            <LinkIcon className="w-4 h-4 mr-2" />
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary truncate"
            >
              {website}
            </a>
          </div>
        )}
        
        {facebookLink && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Facebook className="w-4 h-4 mr-2" />
            <a 
              href={facebookLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Facebook
            </a>
          </div>
        )}
        
        {instagramLink && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Instagram className="w-4 h-4 mr-2" />
            <a 
              href={instagramLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Instagram
            </a>
          </div>
        )}
        
        {twitterLink && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Twitter className="w-4 h-4 mr-2" />
            <a 
              href={twitterLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              Twitter
            </a>
          </div>
        )}
        
        {discordLink && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4 mr-2" />
            <a 
              href={discordLink} 
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
  );
};

export default ContactSection;
