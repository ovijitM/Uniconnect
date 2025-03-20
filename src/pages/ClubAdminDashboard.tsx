
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
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
    clubId: ''
  });
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  // New club form state
  const [clubFormData, setClubFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [isClubDialogOpen, setIsClubDialogOpen] = useState(false);

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  useEffect(() => {
    fetchClubAdminData();
  }, [user?.id]);

  const fetchClubAdminData = async () => {
    setIsLoading(true);
    try {
      // Fetch clubs where the current user is an admin
      const { data: clubAdminData, error: clubAdminError } = await supabase
        .from('club_admins')
        .select('club_id')
        .eq('user_id', user.id);

      if (clubAdminError) throw clubAdminError;

      // If user is not an admin of any clubs, show empty state
      if (clubAdminData.length === 0) {
        setAdminClubs([]);
        setClubEvents([]);
        setClubMembers([]);
        setActiveEventCount(0);
        setPastEventCount(0);
        setTotalMembersCount(0);
        setAverageAttendance(0);
        setIsLoading(false);
        return;
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
  };

  const handleCreateClub = async () => {
    try {
      if (!clubFormData.name || !clubFormData.description || !clubFormData.category) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      // First, create the club
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .insert({
          name: clubFormData.name,
          description: clubFormData.description,
          category: clubFormData.category,
          logo_url: null,
        })
        .select();
      
      if (clubError) throw clubError;
      
      // Then, add the current user as an admin of the club
      const { error: adminError } = await supabase
        .from('club_admins')
        .insert({
          club_id: clubData[0].id,
          user_id: user.id,
        });
      
      if (adminError) throw adminError;
      
      toast({
        title: 'Success',
        description: 'Club created successfully!',
        variant: 'default',
      });
      
      // Reset form and close dialog
      setClubFormData({
        name: '',
        description: '',
        category: ''
      });
      setIsClubDialogOpen(false);
      
      // Refresh data
      fetchClubAdminData();
    } catch (error) {
      console.error('Error creating club:', error);
      toast({
        title: 'Error',
        description: 'Failed to create club. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!eventFormData.clubId) {
        // If no club is selected and there are clubs available
        if (adminClubs.length > 0) {
          eventFormData.clubId = adminClubs[0].id;
        } else {
          toast({
            title: 'Error',
            description: 'You must create a club first before creating events.',
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Validate required fields
      if (!eventFormData.title || !eventFormData.description || !eventFormData.date || 
          !eventFormData.location || !eventFormData.category) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventFormData.title,
          description: eventFormData.description,
          date: new Date(eventFormData.date).toISOString(),
          location: eventFormData.location,
          category: eventFormData.category,
          max_participants: eventFormData.maxParticipants ? parseInt(eventFormData.maxParticipants) : null,
          club_id: eventFormData.clubId,
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
      setEventFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: '',
        maxParticipants: '',
        clubId: ''
      });
      setIsEventDialogOpen(false);
      
      // Refresh event data
      fetchClubAdminData();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClubFormData(prev => ({ ...prev, [name]: value }));
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

  const NoClubsView = () => (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Welcome to Club Admin Dashboard</h2>
      <p className="text-muted-foreground mb-8">You haven't created any clubs yet. Create your first club to get started.</p>
      <Dialog open={isClubDialogOpen} onOpenChange={setIsClubDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Your First Club
          </Button>
        </DialogTrigger>
        {/* Club Dialog Content will be reused below */}
      </Dialog>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {adminClubs.length === 0 && !isLoading ? (
            <NoClubsView />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Club Admin Dashboard</h1>
                
                <div className="flex gap-3">
                  <Dialog open={isClubDialogOpen} onOpenChange={setIsClubDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Club
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Create New Club</DialogTitle>
                        <DialogDescription>
                          Fill in the details below to create a new club.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={clubFormData.name}
                            onChange={handleClubInputChange}
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
                            value={clubFormData.description}
                            onChange={handleClubInputChange}
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
                            value={clubFormData.category}
                            onChange={handleClubInputChange}
                            className="col-span-3"
                            placeholder="e.g., Sports, Technology, Arts"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleCreateClub}>Create Club</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
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
                            value={eventFormData.title}
                            onChange={handleEventInputChange}
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
                            value={eventFormData.description}
                            onChange={handleEventInputChange}
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
                            value={eventFormData.date}
                            onChange={handleEventInputChange}
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
                            value={eventFormData.location}
                            onChange={handleEventInputChange}
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
                            value={eventFormData.category}
                            onChange={handleEventInputChange}
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
                            value={eventFormData.maxParticipants}
                            onChange={handleEventInputChange}
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
                              value={eventFormData.clubId}
                              onChange={handleEventInputChange as any}
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
                    <CardTitle>Your Clubs</CardTitle>
                    <CardDescription>Clubs you administer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : adminClubs.length > 0 ? (
                      <div className="space-y-4">
                        {adminClubs.map(club => (
                          <div key={club.id} className="flex items-center p-3 bg-secondary/50 rounded-lg">
                            <div className="bg-primary/10 p-2 rounded-full mr-3">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{club.name}</h4>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {club.category}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No clubs yet</p>
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
                          onClick={() => setIsEventDialogOpen(true)}
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
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubAdminDashboard;
