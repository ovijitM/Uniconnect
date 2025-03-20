
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminDashboardHeaderProps {
  userName: string;
  userCount: number;
  clubCount: number;
  adminCount: number;
  systemStatus: string;
  isLoading: boolean;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  userName,
  userCount,
  clubCount,
  adminCount,
  systemStatus,
  isLoading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground">Welcome, {userName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Users</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
              ) : (
                userCount
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Clubs</CardTitle>
            <CardDescription>Registered organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Building className="mr-2 h-6 w-6 text-primary" />
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
              ) : (
                clubCount
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Admin Count</CardTitle>
            <CardDescription>System administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center">
              <Shield className="mr-2 h-6 w-6 text-primary" />
              {isLoading ? (
                <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
              ) : (
                adminCount
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Status</CardTitle>
            <CardDescription>Platform health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center text-green-500">
              <Activity className="mr-2 h-6 w-6" />
              {systemStatus}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboardHeader;
