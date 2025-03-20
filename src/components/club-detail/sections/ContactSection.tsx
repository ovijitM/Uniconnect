
import React from 'react';
import { Facebook, Instagram, Twitter, MessageSquare, Phone as PhoneIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      
      <div className="flex flex-col gap-3 mb-4">
        {phoneNumber && (
          <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 mr-1 group-hover:border-primary">
              <PhoneIcon className="w-4 h-4" />
            </Button>
            {phoneNumber}
          </a>
        )}
        
        {website && (
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 mr-1 group-hover:border-primary">
              <LinkIcon className="w-4 h-4" />
            </Button>
            <span className="truncate">Website</span>
          </a>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {facebookLink && (
          <a 
            href={facebookLink} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Facebook className="w-4 h-4" />
            </Button>
          </a>
        )}
        
        {instagramLink && (
          <a 
            href={instagramLink} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Instagram className="w-4 h-4" />
            </Button>
          </a>
        )}
        
        {twitterLink && (
          <a 
            href={twitterLink} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Twitter className="w-4 h-4" />
            </Button>
          </a>
        )}
        
        {discordLink && (
          <a 
            href={discordLink} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Discord"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
