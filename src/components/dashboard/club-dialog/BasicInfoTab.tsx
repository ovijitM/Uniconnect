
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    university?: string;
    logoUrl?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange, onFileUpload }) => {
  const handleLogoUpload = (url: string, fileName: string) => {
    if (onFileUpload) {
      onFileUpload(url, fileName, 'logo');
    }
  };

  return (
    <div className="space-y-4 py-4">
      {/* Club Logo */}
      <div className="space-y-2">
        <Label>Club Logo *</Label>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {formData.logoUrl ? (
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.logoUrl} alt={formData.name || "Club logo"} />
                <AvatarFallback className="text-xl">
                  {formData.name?.substring(0, 2) || "CL"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Card className="h-24 w-24 flex items-center justify-center text-muted-foreground">
                No Logo
              </Card>
            )}
          </div>
          <div className="flex-grow">
            <FileUpload 
              onUploadComplete={handleLogoUpload}
              acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
              maxFileSize={5}
              buttonText="Upload Logo"
              helperText="Upload a logo for your club (JPEG, PNG, GIF, max 5MB)"
              uploadType="logo"
            />
          </div>
        </div>
      </div>
      
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
