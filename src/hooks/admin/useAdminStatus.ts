
import { useState } from 'react';

// Helper function to format time ago
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export const useAdminStatus = () => {
  const [systemStatus, setSystemStatus] = useState('Healthy');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);

  const buildRecentActivity = (clubsData: any[], eventsData: any[]) => {
    // Get recent club activity (newest 3 clubs)
    const recentClubs = clubsData.slice(0, 3).map(club => ({
      type: 'club',
      id: club.id,
      name: club.name,
      description: `New club created ${formatTimeAgo(club.created_at)}`,
      created_at: club.created_at,
      status: club.status
    }));

    const recentEvents = eventsData.map(event => ({
      type: 'event',
      id: event.id,
      name: event.title,
      description: `Event created by ${event.clubs?.name || 'Unknown Club'}`,
      created_at: event.created_at
    }));

    // Combine and sort recent activity
    return [...recentClubs, ...recentEvents]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  };

  return { 
    systemStatus, 
    recentActivity, 
    systemAlerts,
    setRecentActivity,
    setSystemAlerts,
    buildRecentActivity
  };
};
