
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
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="Official email address for inquiries"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Contact Phone</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone number for contacting the club"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Club Logo</Label>
          <FileUpload 
            onUploadComplete={handleLogoUpload}
            accept="image/*"
            maxSize={5}
            currentFile={formData.logoUrl}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Club Documents (Constitution, Bylaws, etc.)</Label>
          <FileUpload 
            onUploadComplete={handleDocumentUpload}
            accept=".pdf,.doc,.docx"
            maxSize={10}
            currentFile={formData.documentUrl}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Social Media</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="social.website">Website</Label>
              <Input
                id="social.website"
                name="social.website"
                value={formData.social.website}
                onChange={handleInputChange}
                placeholder="https://your-club-website.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social.instagram">Instagram</Label>
              <Input
                id="social.instagram"
                name="social.instagram"
                value={formData.social.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social.facebook">Facebook</Label>
              <Input
                id="social.facebook"
                name="social.facebook"
                value={formData.social.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social.twitter">Twitter</Label>
              <Input
                id="social.twitter"
                name="social.twitter"
                value={formData.social.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social.linkedin">LinkedIn</Label>
              <Input
                id="social.linkedin"
                name="social.linkedin"
                value={formData.social.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/yourclub"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social.discord">Discord</Label>
              <Input
                id="social.discord"
                name="social.discord"
                value={formData.social.discord}
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
