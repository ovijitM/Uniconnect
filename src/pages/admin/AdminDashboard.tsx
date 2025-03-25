
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <AdminDashboardHeader />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<AdminTabs />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
