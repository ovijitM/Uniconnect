
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    logoUrl?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
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
          value={formData.tagline}
          onChange={onInputChange}
          className="col-span-3"
          placeholder="A short catchy phrase for your club"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category *
        </Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={onInputChange}
          className="col-span-3"
          placeholder="e.g., Technology, Sports, Arts, Academic"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="description" className="text-right mt-3">
          Description *
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          className="col-span-3"
          rows={5}
          placeholder="Detailed description of the club"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="logoUrl" className="text-right">
          Logo/Profile Image URL *
        </Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          value={formData.logoUrl}
          onChange={onInputChange}
          className="col-span-3"
          placeholder="URL to your club logo or profile image"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
