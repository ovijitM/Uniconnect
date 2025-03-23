
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if user was trying to access a dashboard route
  const isDashboardRoute = location.pathname.includes('dashboard');
  const isClubRelated = location.pathname.includes('club') || location.pathname.includes('events');
  const isAdminRelated = location.pathname.includes('admin');

  // Determine where to redirect the user
  const getBackLink = () => {
    if (isClubRelated && isDashboardRoute) {
      return "/club-admin-dashboard";
    } else if (isAdminRelated) {
      return "/admin-dashboard";
    } else if (isDashboardRoute) {
      return "/student-dashboard";
    }
    return "/";
  };

  const getBackText = () => {
    if (isClubRelated && isDashboardRoute) {
      return "Back to Club Admin Dashboard";
    } else if (isAdminRelated) {
      return "Back to Admin Dashboard";
    } else if (isDashboardRoute) {
      return "Back to Student Dashboard";
    }
    return "Return to Home";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link to={getBackLink()}>
          <Button className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getBackText()}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
