
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { useClubFileUpload } from '@/hooks/club-admin/useClubFileUpload';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentUploadTabProps {
  formData: {
    documentUrl?: string;
    documentName?: string;
    logoUrl?: string;
  };
  onFileUpload?: (url: string, fileName: string, type: 'logo' | 'document') => void;
}

const DocumentUploadTab: React.FC<DocumentUploadTabProps> = ({
  formData,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [documentUploading, setDocumentUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const { handleClubFileUpload, isUploading } = useClubFileUpload();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadError(null);
      if (type === 'logo') setLogoUploading(true);
      else setDocumentUploading(true);
      
      console.log(`Starting ${type} upload with file: ${file.name}, size: ${file.size} bytes`);
      
      // Use the club file upload hook for the actual upload
      const fileUrl = await handleClubFileUpload(file);
      
      if (fileUrl && onFileUpload) {
        onFileUpload(fileUrl, file.name, type);
        toast({
          title: 'Upload successful',
          description: `${type === 'logo' ? 'Logo' : 'Document'} uploaded successfully`,
        });
      } else {
        setUploadError(`Failed to upload ${type}. Please try again.`);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setUploadError(error instanceof Error ? error.message : `Error uploading ${type}`);
      toast({
        title: `Error uploading ${type}`,
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      if (type === 'logo') setLogoUploading(false);
      else setDocumentUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {uploadError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="logo">Club Logo Image *</Label>
        <div className="flex items-center gap-3">
          <Input
            id="logo"
            type="file"
            accept="image/*"
            ref={logoInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e, 'logo')}
          />
          <Button 
            type="button" 
            variant={formData.logoUrl ? "outline" : "destructive"}
            onClick={() => logoInputRef.current?.click()}
            className="w-full"
            disabled={logoUploading}
          >
            {logoUploading ? 'Uploading...' : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
              </>
            )}
          </Button>
          {formData.logoUrl ? (
            <div className="flex items-center gap-2">
              <img 
                src={formData.logoUrl} 
                alt="Logo preview" 
                className="h-10 w-10 object-cover rounded-md" 
              />
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Required</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Upload a logo for your club (PNG, JPG, SVG).</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="document">Club Constitution (Optional)</Label>
        <div className="flex items-center gap-3">
          <Input
            id="document"
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e, 'document')}
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={documentUploading}
          >
            {documentUploading ? 'Uploading...' : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {formData.documentUrl ? 'Change Document' : 'Upload Document'}
              </>
            )}
          </Button>
          {formData.documentUrl && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                {formData.documentName || 'Document uploaded'}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Upload your club's constitution or bylaws (PDF, DOC).</p>
      </div>
    </div>
  );
};

export default DocumentUploadTab;
