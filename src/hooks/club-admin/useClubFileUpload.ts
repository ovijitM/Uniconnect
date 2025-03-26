
import { useState } from 'react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useToast } from '@/hooks/use-toast';

export const useClubFileUpload = (clubId?: string) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument } = useDocumentUpload({
    entityType: 'club',
    entityId: clubId,
    maxSize: 5, // 5MB max size
  });

  const handleClubFileUpload = async (file: File, fileType: 'logo' | 'document' = 'document'): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      if (!file) {
        toast({
          title: 'No file selected',
          description: 'Please select a file to upload',
          variant: 'destructive',
        });
        return null;
      }

      console.log(`Processing club ${fileType}: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      const fileUrl = await uploadDocument(file, fileType);
      
      if (fileUrl) {
        console.log(`Club ${fileType} uploaded successfully, URL:`, fileUrl);
        return fileUrl;
      }
      
      console.log(`Club ${fileType} upload returned null URL`);
      return null;
    } catch (error) {
      console.error(`Error uploading club ${fileType}:`, error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'There was an error uploading your file',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleClubFileUpload,
    isUploading
  };
};
