
import { supabase } from '@/integrations/supabase/client';
import { Club, Event } from '@/types';

/**
 * Optimized service layer for club admin operations
 * with built-in error handling and type safety
 */
export const clubAdminService = {
  /**
   * Create a new club with optimized batch processing
   */
  async createClub(clubData: any, userId: string): Promise<{ success: boolean; club?: Club; error?: string }> {
    try {
      // Validate required fields
      if (!clubData.name || !clubData.university_id || !clubData.category) {
        return { 
          success: false, 
          error: 'Missing required fields: name, university, or category' 
        };
      }
      
      // Use the insert_club RPC function for atomic club creation
      const { data, error } = await supabase.rpc('insert_club', {
        name: clubData.name,
        description: clubData.description,
        category: clubData.category,
        university: clubData.university,
        university_id: clubData.university_id,
        logo_url: clubData.logo_url,
        club_admin_id: userId
      });
      
      if (error) throw error;
      
      const clubId = data;
      
      // Update additional club details
      if (clubId) {
        const { data: updatedClub, error: updateError } = await supabase
          .from('clubs')
          .update({
            tagline: clubData.tagline,
            established_year: clubData.established_year,
            // Add other fields as needed
          })
          .eq('id', clubId)
          .select('*')
          .single();
          
        if (updateError) throw updateError;
        
        return { 
          success: true, 
          club: updatedClub 
        };
      }
      
      throw new Error('Failed to get club ID after creation');
      
    } catch (error: any) {
      console.error('Error creating club:', error);
      return {
        success: false,
        error: error.message || 'Failed to create club'
      };
    }
  },
  
  /**
   * Update an existing club with optimized validation
   */
  async updateClub(clubId: string, clubData: any, userId: string): Promise<{ success: boolean; club?: Club; error?: string }> {
    try {
      // First check if user is admin for this club
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('club_admins')
        .select('*', { count: 'exact', head: true })
        .eq('club_id', clubId)
        .eq('user_id', userId);
        
      if (adminCheckError) throw adminCheckError;
      
      if (!adminCheck || adminCheck === 0) {
        return { 
          success: false, 
          error: 'You do not have permission to update this club' 
        };
      }
      
      // Update club with optimized query
      const { data: updatedClub, error: updateError } = await supabase
        .from('clubs')
        .update(clubData)
        .eq('id', clubId)
        .select('*')
        .single();
        
      if (updateError) throw updateError;
      
      return { 
        success: true, 
        club: updatedClub 
      };
      
    } catch (error: any) {
      console.error('Error updating club:', error);
      return {
        success: false,
        error: error.message || 'Failed to update club'
      };
    }
  },
  
  /**
   * Delete a club with cascading deletion handling
   */
  async deleteClub(clubId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First check if user is admin for this club
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('club_admins')
        .select('*', { count: 'exact', head: true })
        .eq('club_id', clubId)
        .eq('user_id', userId);
        
      if (adminCheckError) throw adminCheckError;
      
      if (!adminCheck || adminCheck === 0) {
        return { 
          success: false, 
          error: 'You do not have permission to delete this club' 
        };
      }
      
      // Delete club - cascade will handle related records
      const { error: deleteError } = await supabase
        .from('clubs')
        .delete()
        .eq('id', clubId);
        
      if (deleteError) throw deleteError;
      
      return { success: true };
      
    } catch (error: any) {
      console.error('Error deleting club:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete club'
      };
    }
  },
  
  /**
   * Create a new event with optimized validation
   */
  async createEvent(eventData: any, userId: string): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
      // Validate club ownership
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('club_admins')
        .select('*', { count: 'exact', head: true })
        .eq('club_id', eventData.club_id)
        .eq('user_id', userId);
        
      if (adminCheckError) throw adminCheckError;
      
      if (!adminCheck || adminCheck === 0) {
        return { 
          success: false, 
          error: 'You do not have permission to create events for this club' 
        };
      }
      
      // Create event
      const { data: newEvent, error: createError } = await supabase
        .from('events')
        .insert(eventData)
        .select('*')
        .single();
        
      if (createError) throw createError;
      
      return { 
        success: true, 
        event: newEvent 
      };
      
    } catch (error: any) {
      console.error('Error creating event:', error);
      return {
        success: false,
        error: error.message || 'Failed to create event'
      };
    }
  },
  
  /**
   * Fetch event attendees with efficient pagination
   */
  async getEventAttendees(eventId: string, page: number = 1, limit: number = 20): Promise<{ 
    attendees: any[]; 
    total: number;
    error?: string 
  }> {
    try {
      // Calculate pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      // Get count first for better performance
      const { count, error: countError } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);
        
      if (countError) throw countError;
      
      // Get attendees with profiles in a JOIN
      const { data: attendees, error } = await supabase
        .from('event_participants')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            email,
            university
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .range(from, to);
        
      if (error) throw error;
      
      return {
        attendees: attendees || [],
        total: count || 0
      };
      
    } catch (error: any) {
      console.error('Error fetching event attendees:', error);
      return {
        attendees: [],
        total: 0,
        error: error.message || 'Failed to fetch attendees'
      };
    }
  }
};
