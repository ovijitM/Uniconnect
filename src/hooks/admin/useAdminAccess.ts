
import { supabase } from '@/integrations/supabase/client';

export const useAdminAccess = () => {
  const verifyAdminAccess = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      console.log("Verifying admin access for user:", userId);
      
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error in verifyAdminAccess:', userError);
        throw userError;
      }
      
      console.log("User role verification result:", userData);
      return userData?.role === 'admin';
    } catch (error) {
      console.error('Error verifying admin access:', error);
      return false;
    }
  };

  return { verifyAdminAccess };
};
