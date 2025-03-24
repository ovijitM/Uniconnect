
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileUpload } from './FileUpload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Download, Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Document {
  name: string;
  url: string;
  id: string;
  created_at: string;
}

interface DocumentManagerProps {
  entityId?: string;
  entityType?: 'club' | 'event' | 'user';
  title?: string;
  description?: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  entityId,
  entityType = 'user',
  title = 'Document Manager',
  description = 'Upload and manage your documents'
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, entityId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Search pattern based on entity type
      const searchPattern = entityId 
        ? `${entityType}_${entityId}/%` 
        : `user_${user?.id}/%`;

      const { data, error } = await supabase
        .storage
        .from('documents')
        .list('', {
          search: searchPattern
        });

      if (error) throw error;

      const files = data.map(file => ({
        name: file.name.split('_').slice(2).join('_'), // Remove prefix
        url: supabase.storage.from('documents').getPublicUrl(file.name).data.publicUrl,
        id: file.id,
        created_at: file.created_at
      }));

      setDocuments(files);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Failed to load documents',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (url: string, fileName: string) => {
    if (!url || !fileName) return;
    
    // The URL already contains the path, we just need to add it to our state
    const newDoc = {
      name: fileName,
      url,
      id: url.split('/').pop() || '',
      created_at: new Date().toISOString()
    };
    
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleDeleteDocument = async (fileId: string) => {
    try {
      // Extract path from URL
      const path = fileId;
      
      const { error } = await supabase
        .storage
        .from('documents')
        .remove([path]);

      if (error) throw error;

      // Update state
      setDocuments(prev => prev.filter(doc => doc.id !== fileId));
      
      toast({
        title: 'Document deleted',
        description: 'Document was successfully deleted',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Failed to delete document',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUpload 
          onFileUpload={handleFileUpload}
          maxSize={10}
          buttonText="Upload New Document"
        />

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Your Documents</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-md" />
              ))}
            </div>
          ) : documents.length > 0 ? (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li key={doc.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.created_at && `Uploaded ${formatDistanceToNow(new Date(doc.created_at))} ago`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No documents uploaded yet</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-xs text-gray-500">Supported formats: PDF, Word, Text</p>
        <Button variant="outline" onClick={fetchDocuments}>Refresh</Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentManager;
