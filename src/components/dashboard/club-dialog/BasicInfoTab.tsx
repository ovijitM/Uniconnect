
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    university?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Club Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Computer Science Club"
          value={formData.name}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline *</Label>
        <Input
          id="tagline"
          name="tagline"
          placeholder="A short catchy phrase for your club"
          value={formData.tagline}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          name="category"
          placeholder="e.g., Academic, Sports, Arts"
          value={formData.category}
          onChange={onInputChange}
          required
        />
      </div>

      {formData.university && (
        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Input
            id="university"
            name="university"
            value={formData.university}
            readOnly
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            University is automatically set from your profile
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your club and its purpose"
          value={formData.description}
          onChange={onInputChange}
          required
          rows={4}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
