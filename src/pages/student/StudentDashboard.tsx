
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import StudentSidebar from '@/components/dashboard/student/StudentSidebar';
import StudentClubs from '@/components/student/StudentClubs';
import UpcomingEventsStudent from '@/components/student/UpcomingEventsStudent';
import RegisteredEvents from '@/components/student/RegisteredEvents';
import AvailableClubs from '@/components/student/AvailableClubs';
import { useStudentData } from '@/hooks/useStudentData';

const StudentDashboard: React.FC = () => {
  // Use the student data hook to get necessary data
  const {
    isLoading = false,
    clubs = [],
    events = [],
    joinedClubs = [],
    registeredEvents = [],
    joinClub = () => {},
    leaveClub = () => {},
    registerForEvent = () => {},
    unregisterFromEvent = () => {}
  } = useStudentData?.() || {};

  // Get the necessary derived data
  const joinedClubIds = joinedClubs.map(club => club.id);
  const registeredEventIds = registeredEvents.map(event => event.id);

  return (
    <DashboardLayout sidebar={<StudentSidebar />}>
      <div className="p-6">
        <Routes>
          <Route path="/" element={
            <div className="space-y-8">
              <UpcomingEventsStudent 
                events={events}
                registeredEventIds={registeredEventIds}
                isLoading={isLoading}
                onRegisterEvent={registerForEvent}
              />
              <StudentClubs 
                clubs={joinedClubs}
                isLoading={isLoading}
                onLeaveClub={leaveClub}
              />
            </div>
          } />
          <Route path="/events" element={
            <RegisteredEvents 
              events={registeredEvents}
              isLoading={isLoading}
              onUnregister={unregisterFromEvent}
            />
          } />
          <Route path="/clubs" element={
            <AvailableClubs 
              clubs={clubs}
              joinedClubIds={joinedClubIds}
              isLoading={isLoading}
              onJoinClub={joinClub}
            />
          } />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
