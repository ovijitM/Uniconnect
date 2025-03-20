
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useClubAdminData } from '@/hooks/useClubAdminData';

// Components
import StatCards from '@/components/dashboard/StatCards';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import ClubsList from '@/components/dashboard/ClubsList';
import EventsTable from '@/components/dashboard/EventsTable';
import MembersTable from '@/components/dashboard/MembersTable';
import CreateClubDialog from '@/components/dashboard/CreateClubDialog';
import CreateEventDialog from '@/components/dashboard/CreateEventDialog';
import NoClubsView from '@/components/dashboard/NoClubsView';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    adminClubs,
    clubEvents,
    clubMembers,
    activeEventCount,
    pastEventCount,
    totalMembersCount,
    averageAttendance,
    isLoading,
    fetchClubAdminData
  } = useClubAdminData(user?.id);

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

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {adminClubs.length === 0 && !isLoading ? (
            <NoClubsView 
              isDialogOpen={isClubDialogOpen}
              setIsDialogOpen={setIsClubDialogOpen}
              clubFormData={clubFormData}
              handleClubInputChange={handleClubInputChange}
              handleCreateClub={handleCreateClub}
            />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Club Admin Dashboard</h1>
                
                <div className="flex gap-3">
                  <CreateClubDialog
                    isOpen={isClubDialogOpen}
                    onOpenChange={setIsClubDialogOpen}
                    formData={clubFormData}
                    onInputChange={handleClubInputChange}
                    onSubmit={handleCreateClub}
                  />
                  
                  <CreateEventDialog
                    isOpen={isEventDialogOpen}
                    onOpenChange={setIsEventDialogOpen}
                    formData={eventFormData}
                    clubs={adminClubs}
                    onInputChange={handleEventInputChange}
                    onSubmit={handleCreateEvent}
                  />
                </div>
              </div>

              <StatCards
                activeEventCount={activeEventCount}
                totalMembersCount={totalMembersCount}
                pastEventCount={pastEventCount}
                averageAttendance={averageAttendance}
                isLoading={isLoading}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <UpcomingEvents 
                  events={clubEvents}
                  isLoading={isLoading}
                  onEditEvent={handleEditEvent}
                  onViewEvent={handleViewEvent}
                />

                <ClubsList 
                  clubs={adminClubs}
                  isLoading={isLoading}
                />
              </div>

              <EventsTable
                events={clubEvents}
                isLoading={isLoading}
                onEditEvent={handleEditEvent}
                onViewEvent={handleViewEvent}
                onCreateEvent={() => setIsEventDialogOpen(true)}
              />

              <MembersTable
                members={clubMembers}
                isLoading={isLoading}
              />
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubAdminDashboard;
