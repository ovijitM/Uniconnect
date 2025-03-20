
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoTabProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tagline?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">
          Title* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          required
          placeholder="Enter event title"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">
          Description* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          required
          className="min-h-[100px]"
          placeholder="Provide a detailed description of your event"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">
          Category* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={onInputChange}
          required
          placeholder="e.g., Tech, Cultural, Sports"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="tagline">
          Tagline* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="tagline"
          name="tagline"
          value={formData.tagline || ''}
          onChange={onInputChange}
          required
          placeholder="A short, catchy phrase about your event"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
