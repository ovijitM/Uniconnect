
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
  
  // First try the format "Name 1, Position 1; Name 2, Position 2"
  const memberEntries = value.split(';').map(entry => entry.trim()).filter(entry => entry.length > 0);
  
  if (memberEntries.length > 0) {
    memberEntries.forEach(entry => {
      const parts = entry.split(',').map(part => part.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const position = parts.slice(1).join(', '); // Join with comma in case position has commas
        if (name && position) {
          members[name] = position;
        }
      }
    });
  }
  
  // If the above format didn't work, try simple JSON parse (in case it was already JSON)
  if (Object.keys(members).length === 0) {
    try {
      // Check if the value looks like JSON
      if (value.startsWith('{') && value.endsWith('}')) {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      }
    } catch (e) {
      console.log("Value is not valid JSON, continuing with normal parsing");
    }
  }
  
  return Object.keys(members).length > 0 ? members : null;
};
