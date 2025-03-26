
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, RefreshCw, School } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface University {
  id: string;
  name: string;
  created_at: string;
}

const UniversityManagement: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [newUniversityName, setNewUniversityName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load universities. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUniversityName.trim()) {
      toast({
        title: 'Error',
        description: 'University name cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('universities')
        .insert([{ name: newUniversityName.trim() }])
        .select();
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new Error('A university with this name already exists');
        }
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'University added successfully',
      });
      
      setNewUniversityName('');
      setUniversities([...(data || []), ...universities]);
    } catch (error) {
      console.error('Error adding university:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add university',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'University deleted successfully',
      });
      
      setUniversities(universities.filter(uni => uni.id !== id));
    } catch (error) {
      console.error('Error deleting university:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete university',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>University Management</CardTitle>
        <CardDescription>Add, view or delete universities that users can select during signup</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUniversity} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Enter university name"
              value={newUniversityName}
              onChange={(e) => setNewUniversityName(e.target.value)}
              className="pl-10"
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !newUniversityName.trim()}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add University
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={fetchUniversities} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </form>

        <div className="space-y-2">
          <div className="font-medium text-sm text-muted-foreground mb-2">
            {isLoading ? 'Loading...' : `${universities.length} Universities`}
          </div>
          
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))
          ) : (
            <>
              {universities.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No universities found. Add your first university above.
                </div>
              ) : (
                universities.map((uni) => (
                  <div key={uni.id} className="flex items-center justify-between p-3 border rounded-md">
                    <span>{uni.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteUniversity(uni.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversityManagement;
