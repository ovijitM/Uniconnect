
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [adminCount, setAdminCount] = useState(0);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data);
      
      // Count admins
      const adminUsers = data.filter(user => user.role === 'admin');
      setAdminCount(adminUsers.length);
      
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  return { users, adminCount, fetchUsers };
};
