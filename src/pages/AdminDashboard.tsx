
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Building, Shield, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not logged in or not an admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">System Administration</h1>
            <p className="text-muted-foreground">Welcome, {user.name}</p>
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
                  246
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
                  15
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
                  3
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
                  Healthy
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Club Activity</CardTitle>
                <CardDescription>Recently created clubs and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Robotics Club</h4>
                      <p className="text-sm text-muted-foreground">New club created 2 days ago</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Annual Tech Conference</h4>
                      <p className="text-sm text-muted-foreground">Large event created by CS Club</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Chess Club</h4>
                      <p className="text-sm text-muted-foreground">New club created 5 days ago</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Database Backup Complete</h4>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-amber-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">High Server Load</h4>
                      <p className="text-sm text-muted-foreground">Yesterday, 8:45 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">System Update Complete</h4>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
