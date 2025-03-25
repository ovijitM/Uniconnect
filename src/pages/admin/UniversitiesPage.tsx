
import React from 'react';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import UniversityManagement from '@/components/admin/UniversityManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const UniversitiesPage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not logged in or not an admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">University Management</h1>
        <UniversityManagement />
      </div>
    </DashboardLayout>
  );
};

export default UniversitiesPage;
