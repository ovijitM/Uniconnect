
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored components
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import RecentActivityPanel from '@/components/admin/RecentActivityPanel';
import SystemAlertsPanel from '@/components/admin/SystemAlertsPanel';
import UsersTable from '@/components/admin/UsersTable';
import ClubsTable from '@/components/admin/ClubsTable';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
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
    reviewClubOrEvent 
  } = useAdminData(user.id);

  const handleReview = async (id: string, type: 'club' | 'event') => {
    const result = await reviewClubOrEvent(id, type);
    if (result.success) {
      navigate(type === 'club' ? `/clubs/${id}` : `/events/${id}`);
    }
  };

  const handleViewClub = (clubId: string) => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <AdminDashboardHeader 
          userName={user.name}
          userCount={users.length}
          clubCount={clubs.length}
          adminCount={adminCount}
          systemStatus={systemStatus}
          isLoading={isLoading}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecentActivityPanel 
                isLoading={isLoading}
                recentActivity={recentActivity}
                onReviewItem={handleReview}
              />
              <SystemAlertsPanel 
                isLoading={isLoading}
                systemAlerts={systemAlerts}
              />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UsersTable 
              users={users}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="clubs">
            <ClubsTable 
              clubs={clubs}
              isLoading={isLoading}
              onViewClub={handleViewClub}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
