import { supabase } from '@/integrations/supabase/client';

/**
 * Finds a university by ID or name, or creates it if it doesn't exist
 * @param universityName University name
 * @param universityId Optional university ID
 * @returns University ID
 */
export const findOrCreateUniversity = async (universityName: string, universityId?: string): Promise<string> => {
  // If we have a university ID, verify it exists
  if (universityId) {
    const { data, error } = await supabase
      .from('universities')
      .select('id')
      .eq('id', universityId)
      .single();
    
    if (!error && data) {
      return universityId;
    }
  }
  
  // Look up university by name
  const { data: existingUniv, error: lookupError } = await supabase
    .from('universities')
    .select('id')
    .ilike('name', universityName)
    .maybeSingle();
  
  if (lookupError) {
    console.error('Error looking up university:', lookupError);
  }
  
  // If university exists, return its ID
  if (existingUniv) {
    return existingUniv.id;
  }
  
  // Otherwise create a new university
  const { data: newUniv, error: createError } = await supabase
    .from('universities')
    .insert({
      name: universityName
    })
    .select('id')
    .single();
  
  if (createError) {
    throw new Error(`Failed to create university: ${createError.message}`);
  }
  
  if (!newUniv) {
    throw new Error('No university data returned after creation');
  }
  
  return newUniv.id;
};
