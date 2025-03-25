
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import StudentSidebar from '@/components/dashboard/student/StudentSidebar';
import StudentClubs from '@/components/student/StudentClubs';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import RegisteredEvents from '@/components/student/RegisteredEvents';
import AvailableClubs from '@/components/student/AvailableClubs';

const StudentDashboard: React.FC = () => {
  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="p-6">
        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              <UpcomingEventsStudent />
              <StudentClubs />
            </div>
          } />
          <Route path="/events" element={<RegisteredEvents />} />
          <Route path="/clubs" element={<AvailableClubs />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
