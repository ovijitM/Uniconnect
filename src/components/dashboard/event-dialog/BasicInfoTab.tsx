
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoTabProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tagline?: string;
    imageUrl?: string; // Add image URL field
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title *
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          className="col-span-3"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tagline" className="text-right">
          Tagline *
        </Label>
        <Input
          id="tagline"
          name="tagline"
          value={formData.tagline}
          onChange={onInputChange}
          className="col-span-3"
          placeholder="A short catchy phrase for your event"
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
          value={formData.category}
          onChange={onInputChange}
          className="col-span-3"
          placeholder="e.g., Workshop, Hackathon, Conference"
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
          placeholder="Detailed description of the event"
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="imageUrl" className="text-right">
          Banner/Poster URL
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={onInputChange}
          className="col-span-3"
          placeholder="URL to your event banner or poster image"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
