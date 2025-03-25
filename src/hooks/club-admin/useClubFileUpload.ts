
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useToast } from '@/hooks/use-toast';

export const useClubFileUpload = (clubId?: string) => {
  const { toast } = useToast();
  const { uploadDocument, isUploading } = useDocumentUpload({
    entityType: 'club',
    entityId: clubId,
    bucket: 'club_assets',
    maxSize: 5, // 5MB max size
  });

  const handleClubFileUpload = async (file: File): Promise<string | null> => {
    try {
      if (!file) {
        toast({
          title: 'No file selected',
          description: 'Please select a file to upload',
          variant: 'destructive',
        });
        return null;
      }

      const fileUrl = await uploadDocument(file);
      if (fileUrl) {
        return fileUrl;
      }
      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your file',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    handleClubFileUpload,
    isUploading
  };
};
