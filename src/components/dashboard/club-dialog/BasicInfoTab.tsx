
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { ClubFormData } from '@/hooks/club-admin/types';

interface BasicInfoTabProps {
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
}

const CLUB_CATEGORIES = [
  'Academic',
  'Arts & Culture',
  'Business',
  'Community Service',
  'Engineering',
  'Environment',
  'Gaming',
  'Health & Wellness',
  'International',
  'Media',
  'Political',
  'Religious',
  'Science',
  'Social',
  'Sports',
  'Technology',
  'Other'
];

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  formData, 
  onInputChange,
  onFileUpload 
}) => {
  const handleLogoUpload = (url: string, fileName: string) => {
    console.log("Logo uploaded:", url, fileName);
    if (onFileUpload) {
      onFileUpload(url, fileName, 'logo');
    }
  };

  const handleCategoryChange = (value: string) => {
    const event = {
      target: {
        name: 'category',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Club Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Enter club name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.category} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CLUB_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          name="tagline"
          value={formData.tagline}
          onChange={onInputChange}
          placeholder="A short tagline for your club"
        />
        <p className="text-xs text-muted-foreground">
          A brief, catchy phrase that represents your club (max 100 characters)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Provide a detailed description of your club"
          rows={5}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Club Logo <span className="text-red-500">*</span></Label>
        {formData.logoUrl ? (
          <div className="flex items-center gap-4">
            <img src={formData.logoUrl} alt="Club logo" className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="text-sm font-medium">Logo uploaded successfully</p>
              <FileUpload 
                bucket="club-logos" 
                onUploadComplete={handleLogoUpload}
                buttonText="Change Logo"
                acceptedFileTypes={{
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png'],
                  'image/svg+xml': ['.svg'],
                }}
                maxFileSize={2}
              />
            </div>
          </div>
        ) : (
          <FileUpload 
            bucket="club-logos" 
            onUploadComplete={handleLogoUpload}
            acceptedFileTypes={{
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'image/svg+xml': ['.svg'],
            }}
            maxFileSize={2}
          />
        )}
        <p className="text-xs text-muted-foreground">
          Upload a logo for your club (PNG, JPG, or SVG, max 2MB)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">University <span className="text-red-500">*</span></Label>
        <Input
          id="university"
          name="university"
          value={formData.university}
          onChange={onInputChange}
          placeholder="Your university"
          required
          readOnly={!!formData.university}
          className={formData.university ? "bg-muted" : ""}
        />
        {formData.university && (
          <p className="text-xs text-muted-foreground">
            University is automatically set from your profile
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoTab;
