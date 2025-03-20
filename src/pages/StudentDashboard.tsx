
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not logged in or not a student
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'student') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <CardDescription>Events you've registered for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <Calendar className="mr-2 h-6 w-6 text-primary" />
                  3
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Clubs</CardTitle>
                <CardDescription>Clubs you're a member of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <Users className="mr-2 h-6 w-6 text-primary" />
                  2
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Past Events</CardTitle>
                <CardDescription>Events you've attended</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <Clock className="mr-2 h-6 w-6 text-primary" />
                  5
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Recent alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center">
                  <Bell className="mr-2 h-6 w-6 text-primary" />
                  2
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events you've registered for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Computer Science Career Fair</h4>
                      <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Programming Workshop</h4>
                      <p className="text-sm text-muted-foreground">Friday, 2:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Networking Mixer</h4>
                      <p className="text-sm text-muted-foreground">Next Monday, 6:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Clubs</CardTitle>
                <CardDescription>Clubs you're a member of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Computer Science Club</h4>
                      <p className="text-sm text-muted-foreground">Member since Oct 2023</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Photography Society</h4>
                      <p className="text-sm text-muted-foreground">Member since Jan 2024</p>
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

export default StudentDashboard;
