
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Clubs from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import StudentDashboard from "./pages/StudentDashboard";
import ClubAdminDashboard from "./pages/ClubAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/events/:eventId/edit" element={<ClubAdminDashboard />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/clubs/:clubId" element={<ClubDetail />} />
              <Route path="/clubs/:clubId/edit" element={<ClubAdminDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Student dashboard routes */}
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/student-dashboard/events" element={<StudentDashboard />} />
              <Route path="/student-dashboard/clubs" element={<StudentDashboard />} />
              
              {/* Club admin dashboard routes */}
              <Route path="/club-admin-dashboard" element={<ClubAdminDashboard />} />
              <Route path="/club-admin-dashboard/events" element={<ClubAdminDashboard />} />
              <Route path="/club-admin-dashboard/clubs" element={<ClubAdminDashboard />} />
              <Route path="/club-admin-dashboard/members" element={<ClubAdminDashboard />} />
              <Route path="/club-admin-dashboard/attendance" element={<ClubAdminDashboard />} />
              <Route path="/club-admin-dashboard/profile" element={<ClubAdminDashboard />} />
              
              {/* Admin dashboard routes */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/notifications" element={<AdminDashboard />} />
              <Route path="/admin-dashboard/settings" element={<AdminDashboard />} />
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
