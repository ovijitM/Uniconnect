
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

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

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  formData, 
  onInputChange,
  onFileUpload 
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

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

      {onFileUpload && (
        <div className="space-y-2">
          <Label htmlFor="logo">Club Logo</Label>
          <div className="flex items-center gap-2">
            <Input
              id="logo"
              type="file"
              accept="image/*"
              ref={logoInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onFileUpload) {
                  // This is a placeholder - the actual upload will be handled by the parent component
                  // through the ClubFileUpload hook, which is called in DocumentUploadTab
                  logoInputRef.current!.value = "";
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
            </Button>
            
            {formData.logoUrl && (
              <img 
                src={formData.logoUrl} 
                alt="Logo preview" 
                className="h-10 w-10 object-cover rounded-md" 
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            You can also upload your club logo in the Documents tab
          </p>
        </div>
      )}
    </div>
  );
};

export default BasicInfoTab;
