
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useClubAdmin = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClubAdmin, setIsClubAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);
  
  useEffect(() => {
    async function checkClubAdmin() {
      if (!user || !clubId) return;
      
      const { data, error } = await supabase
        .from('club_admins')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking club admin status:', error);
      } else {
        setIsClubAdmin(!!data);
      }
    }
    
    checkClubAdmin();
  }, [user, clubId]);

  return {
    isAdmin,
    isClubAdmin
  };
};
