
import React from 'react';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { Badge } from '@/components/ui/badge';
import { ClubFormData } from '@/hooks/club-admin/types';
import { Trash2 } from 'lucide-react';

interface DocumentUploadTabProps {
  formData: ClubFormData;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
}

const DocumentUploadTab: React.FC<DocumentUploadTabProps> = ({ 
  formData,
  onFileUpload
}) => {
  const handleDocumentUpload = (url: string, fileName: string) => {
    if (onFileUpload) {
      onFileUpload(url, fileName, 'document');
    }
  };

  const removeDocument = () => {
    if (onFileUpload) {
      onFileUpload('', '', 'document');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Club Documents
        </Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload documents like your club constitution, bylaws, or other important files.
        </p>
        
        {formData.documentUrl ? (
          <div className="flex items-center gap-4 p-4 border rounded-md">
            <div className="flex-1">
              <p className="font-medium">{formData.documentName}</p>
              <a 
                href={formData.documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Document
              </a>
            </div>
            <button 
              type="button"
              onClick={removeDocument}
              className="text-destructive hover:text-destructive/80"
              aria-label="Remove document"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <FileUpload 
            onUpload={(url, fileName) => handleDocumentUpload(url, fileName)} 
            acceptedFileTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
            maxSizeInMB={10}
            uploadText="Upload Document"
          />
        )}
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="font-semibold mb-4">Final Submission Notes</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">Note</Badge>
            <span>Your club will be submitted for review and approval by university administrators.</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">Note</Badge>
            <span>You'll be notified when your club is approved or if there are any issues.</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="outline" className="mt-0.5">Note</Badge>
            <span>Once approved, you can add events and start managing your club activities.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploadTab;
