
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Clock, LineChart, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [adminClubs, setAdminClubs] = useState<any[]>([]);
  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [activeEventCount, setActiveEventCount] = useState(0);
  const [pastEventCount, setPastEventCount] = useState(0);
  const [totalMembersCount, setTotalMembersCount] = useState(0);
  const [averageAttendance, setAverageAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // New event form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
    clubId: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  useEffect(() => {
    async function fetchClubAdminData() {
      setIsLoading(true);
      try {
        // Fetch clubs where the current user is an admin
        const { data: clubAdminData, error: clubAdminError } = await supabase
          .from('club_admins')
          .select('club_id')
          .eq('user_id', user.id);

        if (clubAdminError) throw clubAdminError;

        if (clubAdminData.length === 0) {
          setIsLoading(false);
          return; // No clubs to fetch
        }

        const clubIds = clubAdminData.map(ca => ca.club_id);
        
        // Fetch clubs data
        const { data: clubsData, error: clubsError } = await supabase
          .from('clubs')
          .select('*')
          .in('id', clubIds);
        
        if (clubsError) throw clubsError;
        
        setAdminClubs(clubsData);

        // Fetch events for these clubs
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            date,
            location,
            category,
            status,
            max_participants,
            club_id,
            event_participants(count)
          `)
          .in('club_id', clubIds)
          .order('date', { ascending: true });
        
        if (eventsError) throw eventsError;
        
        setClubEvents(eventsData);
        
        // Count active (upcoming + ongoing) and past events
        const active = eventsData.filter(event => ['upcoming', 'ongoing'].includes(event.status)).length;
        const past = eventsData.filter(event => event.status === 'past').length;
        
        setActiveEventCount(active);
        setPastEventCount(past);
        
        // Calculate average attendance
        const eventsWithAttendance = eventsData.filter(event => event.event_participants[0]?.count);
        if (eventsWithAttendance.length > 0) {
          const totalAttendance = eventsWithAttendance.reduce((sum, event) => sum + event.event_participants[0]?.count || 0, 0);
          setAverageAttendance(Math.round(totalAttendance / eventsWithAttendance.length));
        }
        
        // Fetch members for these clubs
        let totalMembers = 0;
        const allMembersPromises = clubIds.map(async (clubId) => {
          const { data: membersData, error: membersError } = await supabase
            .from('club_members')
            .select(`
              user_id,
              created_at,
              profiles(name, email)
            `)
            .eq('club_id', clubId);
          
          if (membersError) throw membersError;
          
          totalMembers += membersData.length;
          return membersData.map(member => ({
            ...member,
            clubId,
            clubName: clubsData.find(club => club.id === clubId)?.name || 'Unknown Club'
          }));
        });
        
        const allMembersArrays = await Promise.all(allMembersPromises);
        const allMembers = allMembersArrays.flat();
        
        setClubMembers(allMembers);
        setTotalMembersCount(totalMembers);
      } catch (error) {
        console.error('Error fetching club admin data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchClubAdminData();
  }, [user?.id, toast]);

  const handleCreateEvent = async () => {
    try {
      if (!formData.clubId) {
        // If not explicitly selected, use the first club
        if (adminClubs.length > 0) {
          formData.clubId = adminClubs[0].id;
        } else {
          toast({
            title: 'Error',
            description: 'You must be an admin of at least one club to create events.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          location: formData.location,
          category: formData.category,
          max_participants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          club_id: formData.clubId,
          status: 'upcoming'
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Event created successfully!',
        variant: 'default',
      });
      
      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        maxParticipants: '',
        clubId: ''
      });
      setIsDialogOpen(false);
      
      // Refresh event data
      const { data: updatedEvents, error: eventsError } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          date,
          location,
          category,
          status,
          max_participants,
          club_id,
          event_participants(count)
        `)
        .in('club_id', adminClubs.map(club => club.id))
        .order('date', { ascending: true });
      
      if (eventsError) throw eventsError;
      
      setClubEvents(updatedEvents);
      
      // Update counts
      const active = updatedEvents.filter(event => ['upcoming', 'ongoing'].includes(event.status)).length;
      const past = updatedEvents.filter(event => event.status === 'past').length;
      
      setActiveEventCount(active);
      setPastEventCount(past);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    navigate(`/events/${eventId}/edit`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new event for your club.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxParticipants" className="text-right">
                      Max Participants
                    </Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  {adminClubs.length > 1 && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="clubId" className="text-right">
                        Club
                      </Label>
                      <select
                        id="clubId"
                        name="clubId"
                        value={formData.clubId}
                        onChange={handleInputChange as any}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        required
                      >
                        <option value="">Select a club</option>
                        {adminClubs.map(club => (
                          <option key={club.id} value={club.id}>{club.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  {isLoading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    activeEventCount
                  )}
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
                  {isLoading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    totalMembersCount
                  )}
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
                  {isLoading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    pastEventCount
                  )}
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
                  {isLoading ? (
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                  ) : (
                    averageAttendance
                  )}
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
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : clubEvents.length > 0 ? (
                  <div className="space-y-4">
                    {clubEvents
                      .filter(event => event.status !== 'past')
                      .slice(0, 5)
                      .map(event => (
                        <div key={event.id} className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditEvent(event.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewEvent(event.id)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No upcoming events. Create one now!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>New club members</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : clubMembers.length > 0 ? (
                  <div className="space-y-4">
                    {clubMembers
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .slice(0, 5)
                      .map(member => (
                        <div key={member.user_id} className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{member.profiles?.name || 'Unknown User'}</h4>
                            <p className="text-sm text-muted-foreground">
                              Joined {new Intl.RelativeTimeFormat('en').format(
                                Math.round((new Date(member.created_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                                'day'
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No members yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>Manage all your club events</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ) : clubEvents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clubEvents.map(event => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{formatDate(event.date)}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              event.status === 'upcoming' 
                                ? 'bg-blue-100 text-blue-800' 
                                : event.status === 'ongoing'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status}
                            </span>
                          </TableCell>
                          <TableCell>{event.event_participants[0]?.count || 0}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditEvent(event.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewEvent(event.id)}
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No events found</p>
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Club Members</CardTitle>
                <CardDescription>All members across your clubs</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ) : clubMembers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Club</TableHead>
                        <TableHead>Joined Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clubMembers.map(member => (
                        <TableRow key={`${member.user_id}-${member.clubId}`}>
                          <TableCell className="font-medium">{member.profiles?.name || 'Unknown User'}</TableCell>
                          <TableCell>{member.profiles?.email || 'N/A'}</TableCell>
                          <TableCell>{member.clubName}</TableCell>
                          <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No members yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubAdminDashboard;
