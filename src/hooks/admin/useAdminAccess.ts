
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminAccess = () => {
  const { toast } = useToast();

  const verifyAdminAccess = async (userId: string | undefined): Promise<boolean> => {
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

  const handleAccessDenied = () => {
    toast({
      title: 'Access Denied',
      description: 'You do not have admin permissions.',
      variant: 'destructive',
    });
  };

  return { verifyAdminAccess, handleAccessDenied };
};
