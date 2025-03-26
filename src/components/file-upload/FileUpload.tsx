
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, File, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onUploadComplete?: (url: string, fileName: string) => void;
  onFileUpload?: (url: string, fileName: string) => void;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  buttonText?: string;
  className?: string;
  defaultValue?: string;
  uploadType?: 'logo' | 'document';
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onFileUpload,
  maxFileSize = 5, // Default max size 5MB
  acceptedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  buttonText = 'Upload Document',
  className,
  defaultValue,
  uploadType = 'document',
  helperText
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(defaultValue || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Max file size is ${maxFileSize}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Check file type (for documents)
    if (uploadType === 'document' && allowedTypes.length && !allowedTypes.includes(file.type)) {
      toast({
        title: 'Unsupported file type',
        description: `Please upload one of the following: ${allowedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    // For logo uploads, only allow image types
    if (uploadType === 'logo' && !file.type.startsWith('image/')) {
      toast({
        title: 'Unsupported file type',
        description: 'Please upload an image file (PNG, JPG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      // Create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Store temporary URL for preview
      setUploadedFile(fileUrl);
      
      // Call either onUploadComplete or onFileUpload callback
      if (onUploadComplete) {
        onUploadComplete(fileUrl, file.name);
      }
      
      if (onFileUpload) {
        onFileUpload(fileUrl, file.name);
      }
      
      toast({
        title: 'File processed',
        description: 'Your file has been processed successfully.',
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (uploadedFile && uploadedFile.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedFile);
    }
    
    setUploadedFile(null);
    setFileName(null);
    
    // Call either callback with empty values to indicate removal
    if (onUploadComplete) {
      onUploadComplete('', '');
    }
    
    if (onFileUpload) {
      onFileUpload('', '');
    }
  };

  // Determine which file types to accept based on uploadType
  const allowedTypes = uploadType === 'logo' 
    ? ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'] 
    : acceptedFileTypes;

  return (
    <div className={cn("space-y-4", className)}>
      {!uploadedFile ? (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {helperText || `Max size: ${maxFileSize}MB`}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={isUploading}
              accept={uploadType === 'logo' ? 'image/*' : allowedTypes.join(',')}
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center flex-1 space-x-3">
            <File className="w-8 h-8 text-blue-500" />
            <div className="flex-1 truncate">
              <p className="font-medium text-sm truncate">{fileName || 'File'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {uploadedFile.substring(0, 50)}...
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {isUploading && (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin">
            <Upload className="w-4 h-4" />
          </div>
          <p className="text-sm">Processing...</p>
        </div>
      )}
    </div>
  );
};
