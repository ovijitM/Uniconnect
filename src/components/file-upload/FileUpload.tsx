
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, File, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onFileUpload?: (url: string, fileName: string) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  buttonText?: string;
  className?: string;
  defaultValue?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  maxSize = 5, // Default max size 5MB
  allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  buttonText = 'Upload Document',
  className,
  defaultValue
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

    // Check file type
    if (allowedTypes.length && !allowedTypes.includes(file.type)) {
      toast({
        title: 'Unsupported file type',
        description: `Please upload one of the following: ${allowedTypes.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      // Generate a unique filename to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setUploadedFile(publicUrl);
      
      if (onFileUpload) {
        onFileUpload(publicUrl, file.name);
      }

      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been uploaded`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
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
              accept={allowedTypes.join(',')}
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center flex-1 space-x-3">
            <File className="w-8 h-8 text-blue-500" />
            <div className="flex-1 truncate">
              <p className="font-medium text-sm truncate">{fileName || 'Document'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {uploadedFile.split('/').pop()}
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
          <p className="text-sm">Uploading...</p>
        </div>
      )}
    </div>
  );
};
