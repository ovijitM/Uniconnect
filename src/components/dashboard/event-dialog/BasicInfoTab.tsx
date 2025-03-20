
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
          Title*
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          required
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
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
