
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoTabProps {
  profileData: {
    name: string;
    category: string;
    tagline: string;
    description: string;
    logoUrl: string;
    establishedYear: string;
    affiliation: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ profileData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name *
        </Label>
        <Input
          id="name"
          name="name"
          value={profileData.name}
          onChange={handleInputChange}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category *
        </Label>
        <Input
          id="category"
          name="category"
          value={profileData.category}
          onChange={handleInputChange}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tagline" className="text-right">
          Tagline
        </Label>
        <Input
          id="tagline"
          name="tagline"
          value={profileData.tagline}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="A short catchy phrase for your club"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description *
        </Label>
        <Textarea
          id="description"
          name="description"
          value={profileData.description}
          onChange={handleInputChange}
          className="col-span-3"
          rows={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="logoUrl" className="text-right">
          Logo URL
        </Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          value={profileData.logoUrl}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="https://example.com/logo.png"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="establishedYear" className="text-right">
          Established Year
        </Label>
        <Input
          id="establishedYear"
          name="establishedYear"
          value={profileData.establishedYear}
          onChange={handleInputChange}
          className="col-span-3"
          type="number"
          placeholder="e.g., 2020"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="affiliation" className="text-right">
          Affiliation
        </Label>
        <Input
          id="affiliation"
          name="affiliation"
          value={profileData.affiliation}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Department or external organization"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
