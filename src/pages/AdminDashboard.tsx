
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '@/hooks/admin';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'overview');
  
  // Redirect if not logged in or not an admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  const { 
    users, 
    clubs, 
    adminCount, 
    systemStatus, 
    recentActivity, 
    systemAlerts, 
    isLoading,
    reviewClubOrEvent,
    fetchAdminData
  } = useAdminData(user.id);

  useEffect(() => {
    if (user?.id) {
      console.log("AdminDashboard: Initializing data fetch");
      // Explicitly call fetchAdminData when component mounts
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

  // Update URL when tab changes
  useEffect(() => {
    if (tabFromUrl !== activeTab) {
      navigate(`/admin-dashboard?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab]);

  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  console.log("AdminDashboard: Current data state", {
    users: users?.length || 0,
    clubs: clubs?.length || 0,
    recentActivity: recentActivity?.length || 0,
    systemAlerts: systemAlerts?.length || 0,
    isLoading
  });

  const handleReview = async (id: string, type: 'club' | 'event') => {
    const result = await reviewClubOrEvent(id, type);
    if (result.success) {
      navigate(type === 'club' ? `/clubs/${id}` : `/events/${id}`);
    }
  };

  const handleViewClub = (clubId: string) => {
    navigate(`/clubs/${clubId}`);
  };

  const handleClubStatusChange = () => {
    fetchAdminData();
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container">
        <AdminDashboardHeader 
          userName={user.name}
          userCount={users.length}
          clubCount={clubs.length}
          adminCount={adminCount}
          systemStatus={systemStatus}
          isLoading={isLoading}
        />

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
    </DashboardLayout>
  );
};

export default AdminDashboard;
