
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import SystemAlertsPanel from '@/components/admin/SystemAlertsPanel';
import { useAdminData } from '@/hooks/admin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const AlertsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { systemAlerts, isLoading, fetchAdminData } = useAdminData(user?.id);
  
  // Redirect if not logged in or not an admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  useEffect(() => {
    if (user?.id) {
      fetchAdminData().catch(error => {
        console.error("Error fetching admin data:", error);
        toast({
          title: 'Error',
          description: 'Failed to load admin dashboard data.',
          variant: 'destructive',
        });
      });
    }
  }, [user?.id]);

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">System Alerts</h1>
        <SystemAlertsPanel 
          systemAlerts={systemAlerts}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default AlertsPage;
