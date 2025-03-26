
export const parseArrayField = (field: string | undefined): string[] => {
  if (!field) return [];
  return field.split(',').map(item => item.trim());
};

export const parseExecutiveMembers = (executiveMembers: string | object | undefined): object => {
  if (!executiveMembers) return {};
  
  try {
    if (typeof executiveMembers === 'string') {
      return JSON.parse(executiveMembers);
    }
    return executiveMembers;
  } catch (error) {
    console.error('Error parsing executive members:', error);
    return {};
  }
};
