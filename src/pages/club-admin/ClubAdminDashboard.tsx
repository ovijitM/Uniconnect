
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardContent from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardContent';

const ClubAdminDashboard: React.FC = () => {
  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <Routes>
        <Route path="/*" element={<ClubAdminDashboardContent />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
