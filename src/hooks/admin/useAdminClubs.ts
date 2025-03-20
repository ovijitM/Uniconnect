
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminClubs = () => {
  const { toast } = useToast();
  const [clubs, setClubs] = useState<any[]>([]);

  const fetchClubs = async () => {
    try {
      console.log("Fetching clubs in useAdminClubs...");
      
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clubs:', error);
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} clubs`);
      setClubs(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }
  };

  // Function to review a club or event
  const reviewClubOrEvent = async (id: string, type: 'club' | 'event') => {
    try {
      toast({
        title: 'Review Started',
        description: `You are now reviewing this ${type}.`,
      });
      
      // In a real implementation, this would open a detailed review interface
      // For now we'll just navigate to the detail page
      return { success: true, id, type };
    } catch (error) {
      console.error(`Error reviewing ${type}:`, error);
      toast({
        title: 'Error',
        description: `Could not start review process for this ${type}.`,
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  return { clubs, fetchClubs, reviewClubOrEvent };
};
