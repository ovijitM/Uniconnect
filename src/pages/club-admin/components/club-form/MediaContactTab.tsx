
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
        <CardDescription>Upload media and add contact details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Club Logo</Label>
          <FileUpload
            onUploadComplete={handleLogoUpload}
            acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
            maxFileSize={2}
            buttonText="Upload Logo"
            helperText="Upload your club logo (Max 2MB, JPEG, PNG, or GIF)"
            uploadType="logo"
            bucket="club_logos"
          />
          {formData.logoUrl && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <img 
                src={formData.logoUrl} 
                alt="Club Logo Preview" 
                className="w-24 h-24 object-contain border rounded-md" 
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Club Documents</Label>
          <FileUpload
            onUploadComplete={handleDocumentUpload}
            acceptedFileTypes={["application/pdf"]}
            maxFileSize={5}
            buttonText="Upload Document"
            helperText="Upload club constitution or other important documents (Max 5MB, PDF only)"
            uploadType="document"
            bucket="club_documents"
          />
          {formData.documentUrl && (
            <div className="mt-2 flex items-center space-x-2">
              <p className="text-sm font-medium">Uploaded: </p>
              <a 
                href={formData.documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {formData.documentName}
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="club@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Contact Phone</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Social Media Links</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="social.website">Website</Label>
              <Input
                id="social.website"
                name="social.website"
                value={formData.social.website}
                onChange={handleInputChange}
                placeholder="https://yourclub.com"
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

        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Any other information you'd like to share about your club"
            rows={3}
          />
        </div>
      </CardContent>
    </>
  );
};

export default MediaContactTab;
