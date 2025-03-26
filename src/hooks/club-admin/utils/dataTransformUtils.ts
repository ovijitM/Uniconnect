
/**
 * Parses a comma-separated string into an array
 */
export const parseArrayField = (value: string | undefined | null): string[] | null => {
  if (!value) return null;
  
  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

/**
 * Parses the executive members string into a structured JSON object
 * Format expected: "Name 1, Position 1; Name 2, Position 2"
 */
export const parseExecutiveMembers = (value: string | undefined | null): Record<string, string> | null => {
  if (!value) return null;
  
  const members: Record<string, string> = {};
  
  const memberEntries = value.split(';').map(entry => entry.trim()).filter(entry => entry.length > 0);
  
  memberEntries.forEach(entry => {
    const [name, position] = entry.split(',').map(part => part.trim());
    if (name && position) {
      members[name] = position;
    }
  });
  
  return Object.keys(members).length > 0 ? members : null;
};
