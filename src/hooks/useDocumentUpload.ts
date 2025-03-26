
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UseDocumentUploadProps {
  entityId?: string;
  entityType?: 'club' | 'event' | 'user';
  maxSize?: number; // in MB
  onSuccess?: (url: string, fileName: string) => void;
}

export const useDocumentUpload = ({
  entityId,
  entityType = 'user',
  maxSize = 10,
  onSuccess
}: UseDocumentUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Determine which bucket to use based on entity type and upload purpose
  const getBucketName = (fileType: 'logo' | 'document' = 'document'): string => {
    if (fileType === 'logo') return 'club_logos';
    return 'club_documents';
  };

  const uploadDocument = async (file: File, fileType: 'logo' | 'document' = 'document'): Promise<string | null> => {
    if (!file) return null;
    
    try {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `Max file size is ${maxSize}MB`,
          variant: 'destructive',
        });
        return null;
      }

      setIsUploading(true);
      console.log(`Uploading ${fileType}: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Generate a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${entityType}_${entityId || user?.id || 'anonymous'}_${uuidv4()}.${fileExt}`;
      const bucketName = getBucketName(fileType);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Upload returned no data');
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      const publicUrl = publicUrlData.publicUrl;
      console.log('File uploaded successfully, URL:', publicUrl);
      
      if (onSuccess) {
        onSuccess(publicUrl, file.name);
      }

      toast({
        title: 'Upload successful',
        description: `${file.name} has been uploaded`,
        variant: 'default',
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (path: string): Promise<boolean> => {
    try {
      if (!path) return true;
      
      // Only attempt to delete if it's a Supabase Storage URL
      if (path.includes('storage.googleapis.com') || path.includes('supabase.co')) {
        // Extract path from URL
        const urlObj = new URL(path);
        const pathName = urlObj.pathname;
        // Find bucket name from path (typically /storage/v1/object/public/BUCKET_NAME/...)
        const pathParts = pathName.split('/');
        const bucketIndex = pathParts.findIndex(part => part === 'public') + 1;
        
        if (bucketIndex > 0 && bucketIndex < pathParts.length) {
          const bucketName = pathParts[bucketIndex];
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          
          if (bucketName && filePath) {
            const { error } = await supabase
              .storage
              .from(bucketName)
              .remove([filePath]);
              
            if (error) {
              console.error('Error removing file from storage:', error);
              throw error;
            }
          }
        }
      }
      
      toast({
        title: 'File removed',
        description: 'The file was successfully removed',
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      console.error('Error removing document:', error);
      toast({
        title: 'Failed to remove file',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    uploadDocument,
    deleteDocument,
    isUploading
  };
};
