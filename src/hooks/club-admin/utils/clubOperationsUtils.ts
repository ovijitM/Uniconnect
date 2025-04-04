
import { supabase } from '@/integrations/supabase/client';

/**
 * Optimized function to check if a user is a club admin
 * with efficient caching pattern
 */
export const isUserClubAdmin = async (userId: string, clubId: string): Promise<boolean> => {
  if (!userId || !clubId) return false;
  
  try {
    // Use a specialized query with head: true to optimize performance
    const { data, error } = await supabase
      .from('club_admins')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('club_id', clubId);
      
    if (error) throw error;
    
    // Return boolean directly based on the count
    return !!data && data > 0;
  } catch (error) {
    console.error('Error checking club admin status:', error);
    return false;
  }
};

/**
 * Efficient batch transaction for club member operations
 */
export const addMembersToClub = async (
  clubId: string, 
  userIds: string[]
): Promise<{ success: boolean, message: string, addedCount: number }> => {
  if (!clubId || !userIds.length) {
    return { 
      success: false, 
      message: 'Missing club ID or user IDs', 
      addedCount: 0 
    };
  }
  
  try {
    // Create membership entries for all users
    const memberships = userIds.map(userId => ({
      club_id: clubId,
      user_id: userId
    }));
    
    // Use upsert with conflict handling for idempotent operation
    const { data, error } = await supabase
      .from('club_members')
      .upsert(memberships, {
        onConflict: 'club_id,user_id',
        ignoreDuplicates: true
      });
      
    if (error) throw error;
    
    return {
      success: true,
      message: `Successfully added ${userIds.length} members to club`,
      addedCount: userIds.length
    };
  } catch (error: any) {
    console.error('Error adding members to club:', error);
    return {
      success: false,
      message: error.message || 'Failed to add members',
      addedCount: 0
    };
  }
};

/**
 * Efficient batch removal of club members
 */
export const removeMembersFromClub = async (
  clubId: string, 
  userIds: string[]
): Promise<{ success: boolean, message: string, removedCount: number }> => {
  if (!clubId || !userIds.length) {
    return {
      success: false,
      message: 'Missing club ID or user IDs',
      removedCount: 0
    };
  }
  
  try {
    // Use a single delete operation with IN clause for better performance
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', clubId)
      .in('user_id', userIds);
      
    if (error) throw error;
    
    return {
      success: true,
      message: `Successfully removed ${userIds.length} members from club`,
      removedCount: userIds.length
    };
  } catch (error: any) {
    console.error('Error removing members from club:', error);
    return {
      success: false,
      message: error.message || 'Failed to remove members',
      removedCount: 0
    };
  }
};

/**
 * Optimized function to get club member statistics
 * Using efficient database queries
 */
export const getClubMemberStatistics = async (clubId: string) => {
  if (!clubId) return { totalMembers: 0, newMembersThisMonth: 0, activeMembers: 0 };
  
  try {
    // Get total members
    const { count: totalCount, error: countError } = await supabase
      .from('club_members')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId);
      
    if (countError) throw countError;
    
    // Get new members this month using a date filter
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const { count: newMembersCount, error: newMembersError } = await supabase
      .from('club_members')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId)
      .gte('created_at', firstDayOfMonth.toISOString());
      
    if (newMembersError) throw newMembersError;
    
    // For this example, we'll consider all members as active
    // In a real application, you might want to define "active" differently
    
    return {
      totalMembers: totalCount || 0,
      newMembersThisMonth: newMembersCount || 0,
      activeMembers: totalCount || 0
    };
  } catch (error) {
    console.error('Error getting club member statistics:', error);
    return { totalMembers: 0, newMembersThisMonth: 0, activeMembers: 0 };
  }
};
