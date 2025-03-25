
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

  const handleClubFileUpload = async (file: File): Promise<string | null> => {
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

      console.log(`Processing club file: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      const fileUrl = await uploadDocument(file);
      
      if (fileUrl) {
        console.log('Club file processed successfully, URL:', fileUrl);
        return fileUrl;
      }
      
      console.log('Club file processing returned null URL');
      return null;
    } catch (error) {
      console.error('Error processing club file:', error);
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'There was an error processing your file',
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
