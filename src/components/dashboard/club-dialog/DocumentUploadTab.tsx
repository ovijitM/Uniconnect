
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface DocumentUploadTabProps {
  formData: {
    documentUrl?: string;
    documentName?: string;
    logoUrl?: string;
  };
  onFileUpload?: (url: string, fileName: string) => void;
}

const DocumentUploadTab: React.FC<DocumentUploadTabProps> = ({
  formData,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'logo') => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(URL.createObjectURL(file), file.name);
      console.log(`${type} uploaded:`, file.name);
    }
  };

  return (
    <div className="space-y-6">
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
            variant="outline"
            onClick={() => logoInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Logo
          </Button>
          {formData.logoUrl && (
            <div className="flex items-center gap-2">
              <img 
                src={formData.logoUrl} 
                alt="Logo preview" 
                className="h-10 w-10 object-cover rounded-md" 
              />
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                Logo uploaded
              </span>
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
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          {formData.documentUrl && (
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {formData.documentName || 'Document uploaded'}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Upload your club's constitution or bylaws (PDF, DOC).</p>
      </div>
    </div>
  );
};

export default DocumentUploadTab;
