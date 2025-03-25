
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseDocumentUploadProps {
  entityId?: string;
  entityType?: 'club' | 'event' | 'user';
  bucket?: string;
  maxSize?: number; // in MB
  onSuccess?: (url: string, fileName: string) => void;
}

export const useDocumentUpload = ({
  entityId,
  entityType = 'user',
  bucket = 'documents',
  maxSize = 10,
  onSuccess
}: UseDocumentUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Helper function to create a bucket if it doesn't exist
  const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
    try {
      // Check if the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketName);
      
      if (bucketExists) {
        return true;
      }
      
      console.log(`Bucket '${bucketName}' doesn't exist, attempting to create it...`);
      
      // Try to create the bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true
      });
      
      if (error) {
        console.error(`Failed to create bucket '${bucketName}':`, error);
        return false;
      }
      
      console.log(`Successfully created bucket '${bucketName}'`);
      return true;
    } catch (error) {
      console.error(`Error ensuring bucket '${bucketName}' exists:`, error);
      return false;
    }
  };

  const uploadDocument = async (file: File): Promise<string | null> => {
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
      console.log(`Starting document upload: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Determine the prefix based on entity type and ID
      const prefix = entityId 
        ? `${entityType}_${entityId}` 
        : `user_${user?.id || 'anonymous'}`;
        
      // Generate a unique filename to prevent overwriting
      const fileExt = file.name.split('.').pop();
      const fileName = `${prefix}/${Date.now()}_${file.name}`;

      console.log('Uploading to path:', fileName, 'in bucket:', bucket);

      // Always try to use the 'public' bucket first as it's most likely to exist
      const effectiveBucket = 'public';
      console.log(`Using bucket: ${effectiveBucket}`);
      
      // Ensure the bucket exists
      const bucketReady = await ensureBucketExists(effectiveBucket);
      if (!bucketReady) {
        throw new Error(`Could not ensure the '${effectiveBucket}' bucket exists. Please check your Supabase storage setup.`);
      }

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(effectiveBucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('File uploaded successfully, data:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(effectiveBucket)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('Generated public URL:', publicUrl);
      
      if (onSuccess) {
        onSuccess(publicUrl, file.name);
      }

      toast({
        title: 'File uploaded successfully',
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
      const { error } = await supabase.storage
        .from('public')  // Always use the public bucket for deletions
        .remove([path]);

      if (error) throw error;

      toast({
        title: 'Document deleted',
        description: 'The document was successfully deleted',
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Failed to delete document',
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
