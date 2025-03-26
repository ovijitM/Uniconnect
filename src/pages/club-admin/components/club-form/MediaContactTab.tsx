
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/file-upload/FileUpload';

interface MediaContactTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleLogoUpload: (url: string, fileName: string) => void;
  handleDocumentUpload: (url: string, fileName: string) => void;
}

const MediaContactTab: React.FC<MediaContactTabProps> = ({
  formData,
  handleInputChange,
  handleLogoUpload,
  handleDocumentUpload
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Media & Contact Information</CardTitle>
        <CardDescription>Add your club's media assets and contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail || ''}
              onChange={handleInputChange}
              placeholder="Official email address for inquiries"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Contact Phone</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              placeholder="Phone number for contacting the club"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Club Logo</Label>
          <FileUpload 
            onUploadComplete={handleLogoUpload}
            maxSize={5}
            buttonText="Upload Club Logo"
            helperText="Upload your club logo (max 5MB, JPG, PNG, or GIF)"
            uploadType="logo"
            currentFile={formData.logoUrl}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Club Documents (Constitution, Bylaws, etc.)</Label>
          <FileUpload 
            onUploadComplete={handleDocumentUpload}
            maxSize={10}
            buttonText="Upload Club Document"
            helperText="Upload club documents like constitution or bylaws (max 10MB, PDF preferred)"
            uploadType="document"
            currentFile={formData.documentUrl}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Social Media</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                placeholder="https://your-club-website.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagramLink">Instagram</Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                value={formData.instagramLink || ''}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebookLink">Facebook</Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                value={formData.facebookLink || ''}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitterLink">Twitter</Label>
              <Input
                id="twitterLink"
                name="twitterLink"
                value={formData.twitterLink || ''}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="socialMediaLinks.linkedin">LinkedIn</Label>
              <Input
                id="socialMediaLinks.linkedin"
                name="socialMediaLinks.linkedin"
                value={formData.socialMediaLinks?.linkedin || ''}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discordLink">Discord</Label>
              <Input
                id="discordLink"
                name="discordLink"
                value={formData.discordLink || ''}
                onChange={handleInputChange}
                placeholder="https://discord.gg/yourclub"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default MediaContactTab;
