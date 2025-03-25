
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminData } from '@/hooks/admin';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'overview');
  
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

  const handleViewClub = (clubId: string) => {
    window.location.href = `/clubs/${clubId}`;
  };

  const handleClubStatusChange = () => {
    fetchAdminData();
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="p-6">
        <AdminDashboardHeader 
          userName={user?.name || 'Admin'}
          userCount={users.length}
          clubCount={clubs.length}
          adminCount={adminCount}
          systemStatus={systemStatus}
          isLoading={isLoading}
        />
        <div className="mt-6">
          <AdminTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            users={users}
            clubs={clubs}
            isLoading={isLoading}
            recentActivity={recentActivity}
            systemAlerts={systemAlerts}
            adminCount={adminCount}
            systemStatus={systemStatus}
            onReviewItem={handleReview}
            onViewClub={handleViewClub}
            onClubStatusChange={handleClubStatusChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
