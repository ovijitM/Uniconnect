
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, File, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onFileUpload?: (url: string, fileName: string) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  buttonText?: string;
  className?: string;
  defaultValue?: string;
  uploadType?: 'logo' | 'document';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  maxSize = 5, // Default max size 5MB
  allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  buttonText = 'Upload Document',
  className,
  defaultValue,
  uploadType = 'document'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(defaultValue || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: `Max file size is ${maxSize}MB`,
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
      // The actual upload happens in the parent component via onFileUpload
      // We just pass the file to the parent and let it handle the upload
      if (onFileUpload) {
        onFileUpload(URL.createObjectURL(file), file.name);
      }
      
      // Store temporary URL for preview
      setUploadedFile(URL.createObjectURL(file));
      
      // Note: The real URL will be set by the parent when upload is complete
      // This is just for preview purposes
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
    
    if (onFileUpload) {
      onFileUpload('', '');
    }
  };

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
                Max size: {maxSize}MB
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
