
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminData } from '@/hooks/admin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    systemStatus, 
    adminCount, 
    users, 
    clubs, 
    isLoading, 
    fetchAdminData 
  } = useAdminData(user?.id);
  
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
        <h1 className="text-2xl font-bold mb-6">System Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>View system status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">System Status</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    systemStatus === 'Healthy' ? 'bg-green-100 text-green-800' : 
                    systemStatus === 'Warning' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Admin Users</span>
                  <span className="font-semibold">{adminCount}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Total Users</span>
                  <span className="font-semibold">{users?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Clubs</span>
                  <span className="font-semibold">{clubs?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Administration Options</CardTitle>
              <CardDescription>Manage system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                System settings can be configured here. Currently in development.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
