
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import OverviewTab from '@/components/admin/OverviewTab';
import { useAdminData } from '@/hooks/admin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Redirect if not logged in or not an admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  const { 
    users = [], 
    clubs = [], 
    adminCount = 0, 
    systemStatus = 'Operational', 
    recentActivity = [], 
    systemAlerts = [], 
    isLoading = false,
    reviewClubOrEvent = async () => ({ success: false }),
    fetchAdminData = async () => {}
  } = useAdminData(user?.id);

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

  const handleReview = async (id: string, type: 'club' | 'event') => {
    const result = await reviewClubOrEvent(id, type);
    if (result.success) {
      window.location.href = type === 'club' ? `/clubs/${id}` : `/events/${id}`;
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container p-6">
        <AdminDashboardHeader 
          userName={user?.name || 'Admin'}
          userCount={users.length}
          clubCount={clubs.length}
          adminCount={adminCount}
          systemStatus={systemStatus}
          isLoading={isLoading}
        />
        
        <div className="mt-6">
          <OverviewTab 
            usersCount={users.length}
            clubsCount={clubs.length}
            adminCount={adminCount}
            systemStatus={systemStatus}
            recentActivity={recentActivity}
            systemAlerts={systemAlerts}
            isLoading={isLoading}
            onReviewItem={handleReview}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
