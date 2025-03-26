
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadProps {
  onUploadComplete: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  buttonText?: string;
  helperText?: string;
  uploadType?: 'logo' | 'document';
  disabled?: boolean;
  maxSize?: number;
  bucket?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete, 
  acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"], 
  maxFileSize = 5, // Default max file size in MB
  maxSize = 5, // Added to handle the prop passed from DocumentManager
  buttonText = "Upload File", 
  helperText = "Upload a file (Max 5MB)",
  uploadType = 'document',
  disabled = false,
  bucket = 'club-files'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();
  
  // Use the maxSize prop if provided, otherwise fall back to maxFileSize
  const effectiveMaxSize = maxSize || maxFileSize;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check file type
    if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
      setUploadError(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
      toast({
        title: "Invalid file type",
        description: `Please upload one of the following file types: ${acceptedFileTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // Check file size
    if (file.size > effectiveMaxSize * 1024 * 1024) {
      setUploadError(`File size exceeds the limit of ${effectiveMaxSize}MB`);
      toast({
        title: "File too large",
        description: `The file exceeds the maximum size of ${effectiveMaxSize}MB`,
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    
    try {
      // Generate a unique file name to prevent overwrites
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${uploadType === 'logo' ? 'logos' : 'documents'}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      // Set success state
      setUploadSuccess(true);
      setUploadProgress(100);
      
      // Call the callback with the public URL and original file name
      onUploadComplete(publicUrl, file.name, uploadType);
      
      // Show success toast
      toast({
        title: "File uploaded successfully",
        description: `Your file ${file.name} has been uploaded.`,
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadError(error.message || 'Failed to upload file');
      
      toast({
        title: "Upload failed",
        description: error.message || 'There was a problem uploading your file.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
    
    // Reset file input
    e.target.value = '';
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <label className="relative cursor-pointer">
          <Button 
            type="button"
            variant="outline" 
            className="w-full" 
            disabled={isUploading || disabled}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Uploading ({uploadProgress}%)...</span>
              </div>
            ) : uploadSuccess ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>File uploaded</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>{buttonText}</span>
              </div>
            )}
          </Button>
          <input
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(',')}
            disabled={isUploading || disabled}
          />
        </label>
        
        {helperText && !uploadError && !uploadSuccess && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
        
        {uploadError && (
          <div className="flex items-center gap-2 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>
    </div>
  );
};
