
import React from 'react';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentUploadTabProps {
  formData: {
    documentUrl?: string;
    documentName?: string;
  };
  onFileUpload?: (url: string, fileName: string) => void;
}

const DocumentUploadTab: React.FC<DocumentUploadTabProps> = ({ formData, onFileUpload }) => {
  return (
    <div className="space-y-4 py-4">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Authorization Documents</h3>
            <p className="text-sm text-gray-500">
              Please upload your university authorization letter or other official documents 
              to verify your club's legitimacy. This will be reviewed by administrators.
            </p>
          </div>
          
          <FileUpload 
            onFileUpload={onFileUpload} 
            defaultValue={formData.documentUrl}
            buttonText="Upload Authorization Document"
            maxSize={10}
            allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          />
          
          {formData.documentUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium">Uploaded Document:</p>
              <a 
                href={formData.documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {formData.documentName || 'View Document'}
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploadTab;
