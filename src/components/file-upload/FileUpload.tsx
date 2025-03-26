
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUploadComplete: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  buttonText: string;
  helperText?: string;
  uploadType?: 'logo' | 'document';
  bucket?: string;
  maxSize?: number; // Alias for maxFileSize to support both props
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  maxFileSize,
  maxSize, // Added support for both naming conventions
  buttonText,
  helperText,
  uploadType = 'logo',
  bucket = 'club_documents'
}) => {
  // Use maxSize as fallback for maxFileSize for backward compatibility
  const fileMaxSize = maxFileSize || maxSize || 5;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Validate file type
    if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`);
      setSelectedFile(null);
      return;
    }
    
    // Validate file size
    if (file.size > fileMaxSize * 1024 * 1024) {
      setError(`File too large. Maximum size: ${fileMaxSize}MB`);
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Create a unique file name to prevent collisions
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${uploadType === 'logo' ? 'logos' : 'documents'}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) throw error;
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      if (urlData && urlData.publicUrl) {
        onUploadComplete(urlData.publicUrl, selectedFile.name, uploadType);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Failed to upload file. Please try again.');
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes.join(',')}
          className="hidden"
          id={`file-upload-${uploadType}`}
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
        
        {selectedFile && (
          <div className="flex items-center justify-between flex-1 p-2 border rounded-md">
            <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
            <div className="flex items-center gap-2">
              {!isUploading && (
                <Button
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={clearSelection}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
              
              {!isUploading && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {helperText && !error && !isUploading && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};
