
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ClubFormData } from '@/hooks/club-admin/types';

interface SocialMediaTabProps {
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SocialMediaTab: React.FC<SocialMediaTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="presidentName" className="text-base font-semibold">
          President Name
        </Label>
        <Input
          id="presidentName"
          name="presidentName"
          value={formData.presidentName}
          onChange={onInputChange}
          placeholder="Name of the club president"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="presidentContact" className="text-base font-semibold">
          President Contact
        </Label>
        <Input
          id="presidentContact"
          name="presidentContact"
          value={formData.presidentContact}
          onChange={onInputChange}
          placeholder="Email address or phone number"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="executiveMembers" className="text-base font-semibold">
          Executive Members
        </Label>
        <Textarea
          id="executiveMembers"
          name="executiveMembers"
          value={formData.executiveMembers}
          onChange={onInputChange}
          placeholder="List of executive members (JSON format)"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Format: {`[{"name": "John Doe", "role": "Vice President", "email": "john@example.com"}]`}
        </p>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="advisors" className="text-base font-semibold">
          Advisors
        </Label>
        <Input
          id="advisors"
          name="advisors"
          value={formData.advisors}
          onChange={onInputChange}
          placeholder="Comma-separated list of faculty advisors"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="phoneNumber" className="text-base font-semibold">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={onInputChange}
          placeholder="Official club phone number"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="website" className="text-base font-semibold">
          Website
        </Label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={onInputChange}
          placeholder="Club website URL"
          type="url"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="space-y-1 flex-1">
          <Label htmlFor="facebookLink" className="text-base font-semibold">
            Facebook
          </Label>
          <Input
            id="facebookLink"
            name="facebookLink"
            value={formData.facebookLink}
            onChange={onInputChange}
            placeholder="Facebook page URL"
            type="url"
          />
        </div>
        
        <div className="space-y-1 flex-1">
          <Label htmlFor="instagramLink" className="text-base font-semibold">
            Instagram
          </Label>
          <Input
            id="instagramLink"
            name="instagramLink"
            value={formData.instagramLink}
            onChange={onInputChange}
            placeholder="Instagram profile URL"
            type="url"
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="space-y-1 flex-1">
          <Label htmlFor="twitterLink" className="text-base font-semibold">
            Twitter
          </Label>
          <Input
            id="twitterLink"
            name="twitterLink"
            value={formData.twitterLink}
            onChange={onInputChange}
            placeholder="Twitter profile URL"
            type="url"
          />
        </div>
        
        <div className="space-y-1 flex-1">
          <Label htmlFor="discordLink" className="text-base font-semibold">
            Discord
          </Label>
          <Input
            id="discordLink"
            name="discordLink"
            value={formData.discordLink}
            onChange={onInputChange}
            placeholder="Discord invite URL"
            type="url"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaTab;
