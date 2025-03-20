
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SocialMediaTabProps {
  formData: {
    phoneNumber?: string;
    website?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    discordLink?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="phoneNumber">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber || ''}
          onChange={onInputChange}
          placeholder="Contact phone number"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="website">
          Website
        </Label>
        <Input
          id="website"
          name="website"
          value={formData.website || ''}
          onChange={onInputChange}
          placeholder="Club website URL"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="facebookLink">
          Facebook
        </Label>
        <Input
          id="facebookLink"
          name="facebookLink"
          value={formData.facebookLink || ''}
          onChange={onInputChange}
          placeholder="Facebook page URL"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="instagramLink">
          Instagram
        </Label>
        <Input
          id="instagramLink"
          name="instagramLink"
          value={formData.instagramLink || ''}
          onChange={onInputChange}
          placeholder="Instagram profile URL"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="twitterLink">
          Twitter
        </Label>
        <Input
          id="twitterLink"
          name="twitterLink"
          value={formData.twitterLink || ''}
          onChange={onInputChange}
          placeholder="Twitter profile URL"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="discordLink">
          Discord
        </Label>
        <Input
          id="discordLink"
          name="discordLink"
          value={formData.discordLink || ''}
          onChange={onInputChange}
          placeholder="Discord server invite URL"
        />
      </div>
    </div>
  );
};

export default SocialMediaTab;
