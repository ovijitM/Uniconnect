
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export const useDocumentUpload = (bucket: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (
    file: File, 
    folder: string = ''
  ): Promise<{ url: string; fileName: string } | null> => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      setProgress(0);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
          }
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      if (urlData && urlData.publicUrl) {
        return {
          url: urlData.publicUrl,
          fileName: file.name
        };
      }
      
      return null;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadFile,
    isUploading,
    progress
  };
};
