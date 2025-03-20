
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    category: string;
    tagline: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">
          Name*
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
          placeholder="Enter club name"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">
          Description*
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          required
          placeholder="Describe what your club is about"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">
          Category*
        </Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={onInputChange}
          required
          placeholder="e.g., Sports, Technology, Arts"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="tagline">
          Tagline
        </Label>
        <Input
          id="tagline"
          name="tagline"
          value={formData.tagline}
          onChange={onInputChange}
          placeholder="A short catchy phrase for your club"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
