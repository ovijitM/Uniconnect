
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, LineChart, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold">Club Admin Dashboard</h1>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Events</CardTitle>
                <CardDescription>Currently running events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-primary" />
                  2
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Club Members</CardTitle>
                <CardDescription>Total registered members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <Users className="mr-2 h-6 w-6 text-primary" />
                  87
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Past Events</CardTitle>
                <CardDescription>Total completed events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <Clock className="mr-2 h-6 w-6 text-primary" />
                  12
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Event Attendance</CardTitle>
                <CardDescription>Average attendees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <LineChart className="mr-2 h-6 w-6 text-primary" />
                  43
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events organized by your club</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Programming Contest</h4>
                      <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 4:00 PM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Industry Panel Discussion</h4>
                      <p className="text-sm text-muted-foreground">Friday, 2:00 PM - 5:00 PM</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>New club members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Alex Johnson</h4>
                      <p className="text-sm text-muted-foreground">Joined 2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Maria Garcia</h4>
                      <p className="text-sm text-muted-foreground">Joined 5 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">James Wilson</h4>
                      <p className="text-sm text-muted-foreground">Joined 1 week ago</p>
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

export default ClubAdminDashboard;
