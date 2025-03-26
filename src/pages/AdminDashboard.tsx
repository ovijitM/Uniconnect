import React, { useState, useEffect } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import { useAdminData } from '@/hooks/admin';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import components
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
  
  // Match patterns for different routes
  const isOverview = useMatch('/admin-dashboard');
  const isNotificationsPage = useMatch('/admin-dashboard/notifications');
  const isSettingsPage = useMatch('/admin-dashboard/settings');
  
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

  // Set active tab based on route
  useEffect(() => {
    if (isNotificationsPage) {
      setActiveTab('notifications');
    } else if (isSettingsPage) {
      setActiveTab('settings');
    }
  }, [isNotificationsPage, isSettingsPage]);

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
    console.log("Club status changed, refreshing admin data...");
    fetchAdminData().catch(error => {
      console.error("Error refreshing admin data:", error);
      toast({
        title: 'Error',
        description: 'Failed to refresh dashboard data.',
        variant: 'destructive',
      });
    });
  };

  // Render content based on current route
  const renderContent = () => {
    if (isNotificationsPage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-medium">{alert.title}</h3>
                <p className="text-muted-foreground">{alert.title}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  {alert.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isSettingsPage) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">System Settings</h1>
          <div className="space-y-4 p-6 border rounded-lg">
            <div className="flex justify-between items-center">
              <span>System Status</span>
              <span className="font-medium">{systemStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Admin Users</span>
              <span className="font-medium">{adminCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Users</span>
              <span className="font-medium">{users.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Clubs</span>
              <span className="font-medium">{clubs.length}</span>
            </div>
          </div>
        </div>
      );
    }

    // Default overview with tabs
    return (
      <>
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
      </>
    );
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
