
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { ClubFormData } from '@/hooks/club-admin/types';

interface BasicInfoTabProps {
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  formData, 
  onInputChange,
  onFileUpload
}) => {
  const handleLogoUpload = (url: string) => {
    if (onFileUpload) {
      onFileUpload(url, 'club-logo.jpg', 'logo');
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
    <div className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="name" className="text-base font-semibold">
          Club Name *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Enter club name"
          required
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="university" className="text-base font-semibold">
          University *
        </Label>
        <Input
          id="university"
          name="university"
          value={formData.university}
          onChange={onInputChange}
          placeholder="Enter university name"
          required
          readOnly
          className="bg-muted"
        />
        <Input
          type="hidden"
          id="universityId"
          name="universityId"
          value={formData.universityId}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="category" className="text-base font-semibold">
          Category *
        </Label>
        <Select 
          value={formData.category} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="community_service">Community Service</SelectItem>
            <SelectItem value="religious">Religious</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="tagline" className="text-base font-semibold">
          Tagline
        </Label>
        <Input
          id="tagline"
          name="tagline"
          value={formData.tagline}
          onChange={onInputChange}
          placeholder="A short slogan for your club"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="description" className="text-base font-semibold">
          Description *
        </Label>
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

      <div className="space-y-1">
        <Label htmlFor="establishedYear" className="text-base font-semibold">
          Established Year
        </Label>
        <Input
          id="establishedYear"
          name="establishedYear"
          value={formData.establishedYear}
          onChange={onInputChange}
          placeholder="Year when the club was established"
          type="number"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="logo" className="text-base font-semibold">
          Club Logo *
        </Label>
        {formData.logoUrl ? (
          <div className="flex items-center gap-4">
            <img 
              src={formData.logoUrl} 
              alt="Club logo" 
              className="w-20 h-20 object-cover rounded-md" 
            />
            <button 
              type="button"
              onClick={() => handleLogoUpload('')}
              className="text-sm text-destructive hover:underline"
            >
              Change Logo
            </button>
          </div>
        ) : (
          <FileUpload 
            onUpload={handleLogoUpload} 
            acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
            maxSizeInMB={5}
            uploadText="Upload Club Logo"
          />
        )}
        <p className="text-sm text-muted-foreground">
          Upload a square image, minimum 200x200 pixels
        </p>
      </div>
    </div>
  );
};

export default BasicInfoTab;
