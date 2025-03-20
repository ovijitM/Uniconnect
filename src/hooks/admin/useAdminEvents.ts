
import { supabase } from '@/integrations/supabase/client';

export const useAdminEvents = () => {
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, club_id, created_at, clubs(name)')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };

  return { fetchEvents };
};
