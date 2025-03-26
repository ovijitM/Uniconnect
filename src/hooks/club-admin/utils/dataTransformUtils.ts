
import { Json } from '@/integrations/supabase/types';

export const parseArrayField = (field: string | undefined): string[] => {
  if (!field) return [];
  return field.split(',').map(item => item.trim());
};

export const parseExecutiveMembers = (executiveMembers: string | object | undefined): Json => {
  if (!executiveMembers) return {};
  
  try {
    if (typeof executiveMembers === 'string') {
      return JSON.parse(executiveMembers) as Json;
    }
    return executiveMembers as Json;
  } catch (error) {
    console.error('Error parsing executive members:', error);
    return {};
  }
};
