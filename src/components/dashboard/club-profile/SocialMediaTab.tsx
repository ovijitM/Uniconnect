
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Globe, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';

interface SocialMediaTabProps {
  profileData: {
    website: string;
    facebookLink: string;
    instagramLink: string;
    twitterLink: string;
    discordLink: string;
    [key: string]: any;
  };
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSaving: boolean;
  handleSave: () => void;
}

const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ 
  profileData, 
  setProfileData,
  handleInputChange, 
  isSaving,
  handleSave 
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="website" className="flex items-center">
          <Globe className="h-4 w-4 mr-2" />
          Website
        </Label>
        <Input
          id="website"
          name="website"
          value={profileData.website || ''}
          onChange={handleInputChange}
          placeholder="https://yourclub.edu"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facebookLink" className="flex items-center">
          <Facebook className="h-4 w-4 mr-2" />
          Facebook Page
        </Label>
        <Input
          id="facebookLink"
          name="facebookLink"
          value={profileData.facebookLink || ''}
          onChange={handleInputChange}
          placeholder="https://facebook.com/yourclubpage"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagramLink" className="flex items-center">
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </Label>
        <Input
          id="instagramLink"
          name="instagramLink"
          value={profileData.instagramLink || ''}
          onChange={handleInputChange}
          placeholder="https://instagram.com/yourclub"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitterLink" className="flex items-center">
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Label>
        <Input
          id="twitterLink"
          name="twitterLink"
          value={profileData.twitterLink || ''}
          onChange={handleInputChange}
          placeholder="https://twitter.com/yourclub"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discordLink" className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-2" />
          Discord Invite
        </Label>
        <Input
          id="discordLink"
          name="discordLink"
          value={profileData.discordLink || ''}
          onChange={handleInputChange}
          placeholder="https://discord.gg/yourclub"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Social Media
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaTab;
