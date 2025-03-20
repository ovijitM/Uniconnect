
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setUserRole(profile.role);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Error fetching profile',
          description: 'Failed to load your profile information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [user, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect to the appropriate dashboard based on user role from database
  const role = userRole || 'student'; // Default to student if role is not set
  const dashboardPath = `/${role.replace('_', '-')}-dashboard`;
  return <Navigate to={dashboardPath} />;
};

export default Profile;
