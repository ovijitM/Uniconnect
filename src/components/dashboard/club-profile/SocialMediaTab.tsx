
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SocialMediaTabProps {
  profileData: {
    phoneNumber: string;
    website: string;
    facebookLink: string;
    instagramLink: string;
    twitterLink: string;
    discordLink: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ profileData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phoneNumber" className="text-right">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={profileData.phoneNumber}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Contact phone number"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="website" className="text-right">
          Website
        </Label>
        <Input
          id="website"
          name="website"
          value={profileData.website}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://your-club-website.com"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="facebookLink" className="text-right">
          Facebook
        </Label>
        <Input
          id="facebookLink"
          name="facebookLink"
          value={profileData.facebookLink}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://facebook.com/your-club"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="instagramLink" className="text-right">
          Instagram
        </Label>
        <Input
          id="instagramLink"
          name="instagramLink"
          value={profileData.instagramLink}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://instagram.com/your-club"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="twitterLink" className="text-right">
          Twitter
        </Label>
        <Input
          id="twitterLink"
          name="twitterLink"
          value={profileData.twitterLink}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://twitter.com/your-club"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="discordLink" className="text-right">
          Discord
        </Label>
        <Input
          id="discordLink"
          name="discordLink"
          value={profileData.discordLink}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://discord.gg/your-invite"
        />
      </div>
    </div>
  );
};

export default SocialMediaTab;
