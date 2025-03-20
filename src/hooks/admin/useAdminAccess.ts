
import { supabase } from '@/integrations/supabase/client';

export const useAdminAccess = () => {
  const verifyAdminAccess = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      
      return userData.role === 'admin';
    } catch (error) {
      console.error('Error verifying admin access:', error);
      return false;
    }
  };

  return { verifyAdminAccess };
};
