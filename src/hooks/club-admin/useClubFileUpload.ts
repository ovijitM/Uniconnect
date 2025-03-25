
import { useState } from 'react';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useToast } from '@/hooks/use-toast';

export const useClubFileUpload = (clubId?: string) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument } = useDocumentUpload({
    entityType: 'club',
    entityId: clubId,
    bucket: 'club_assets',
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

      console.log('Starting file upload with file:', file.name, 'size:', file.size);
      
      const fileUrl = await uploadDocument(file);
      
      if (fileUrl) {
        console.log('File upload successful, URL:', fileUrl);
        return fileUrl;
      }
      
      console.log('File upload returned null URL');
      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your file',
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
