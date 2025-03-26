
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const findOrCreateUniversity = async (universityName: string, universityId?: string) => {
  const { toast } = useToast();
  
  try {
    // Return existing universityId if provided
    if (universityId) {
      console.log("Using provided university ID:", universityId);
      return universityId;
    }
    
    console.log("Looking up university:", universityName);
    
    // Try to find the university
    const { data: uniData, error: uniError } = await supabase
      .from('universities')
      .select('id')
      .eq('name', universityName)
      .maybeSingle();
      
    if (uniError) {
      console.error('Error finding university:', uniError);
      throw new Error(`Failed to verify university: ${uniError.message}`);
    } 
    
    if (uniData) {
      console.log("Found existing university ID:", uniData.id);
      return uniData.id;
    }
    
    console.log("University not found, creating new one");
    // Create the university if it doesn't exist
    const { data: newUni, error: createError } = await supabase
      .from('universities')
      .insert({ name: universityName })
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating university:', createError);
      throw new Error(`Failed to create university record: ${createError.message}`);
    }
    
    console.log("Created new university with ID:", newUni.id);
    return newUni.id;
  } catch (error) {
    console.error("Error in findOrCreateUniversity:", error);
    throw error;
  }
};
