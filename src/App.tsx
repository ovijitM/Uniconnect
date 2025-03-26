
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Clubs from '@/pages/Clubs';
import Events from '@/pages/Events';
import ClubDetail from '@/pages/ClubDetail';
import EventDetail from '@/pages/EventDetail';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import Universities from '@/pages/Universities';

// Auth routes
import RequireAuth from '@/components/auth/RequireAuth';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersPage from '@/pages/admin/UsersPage';
import ClubsPage from '@/pages/admin/ClubsPage';
import UniversitiesPage from '@/pages/admin/UniversitiesPage';
import AlertsPage from '@/pages/admin/AlertsPage';
import ActivityPage from '@/pages/admin/ActivityPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import ClubAdminDashboard from '@/pages/club-admin/ClubAdminDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';

// Context providers
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:id" element={<ClubDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/settings" element={<Settings />} />

            {/* Protected admin routes */}
            <Route path="/admin-dashboard" element={
              <RequireAuth allowedRoles={['admin']}>
                <AdminDashboard />
              </RequireAuth>
            } />
            <Route path="/admin-dashboard/users" element={
              <RequireAuth allowedRoles={['admin']}>
                <UsersPage />
              </RequireAuth>
            } />
            <Route path="/admin-dashboard/clubs" element={
              <RequireAuth allowedRoles={['admin']}>
                <ClubsPage />
              </RequireAuth>
            } />
            <Route path="/admin-dashboard/universities" element={
              <RequireAuth allowedRoles={['admin']}>
                <UniversitiesPage />
              </RequireAuth>
            } />
            <Route path="/admin-dashboard/alerts" element={
              <RequireAuth allowedRoles={['admin']}>
                <AlertsPage />
              </RequireAuth>
            } />
            <Route path="/admin-dashboard/activity" element={
              <RequireAuth allowedRoles={['admin']}>
                <ActivityPage />
              </RequireAuth>
            } />
            <Route path="/admin-dashboard/settings" element={
              <RequireAuth allowedRoles={['admin']}>
                <SettingsPage />
              </RequireAuth>
            } />
            
            {/* Club admin routes */}
            <Route path="/club-admin-dashboard/*" element={
              <RequireAuth allowedRoles={['club_admin']}>
                <ClubAdminDashboard />
              </RequireAuth>
            } />
            
            {/* Student routes */}
            <Route path="/student-dashboard/*" element={
              <RequireAuth allowedRoles={['student']}>
                <StudentDashboard />
              </RequireAuth>
            } />

            {/* Fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
