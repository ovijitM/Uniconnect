
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
  
  console.log("Parsed executive members:", members);
  return Object.keys(members).length > 0 ? members : null;
};

/**
 * Log structured data for debugging purposes
 */
export const logFormData = (formData: any, label: string = 'Form Data') => {
  console.log(`${label}:`, JSON.stringify(formData, null, 2));
};

/**
 * Validates that required fields are present
 */
export const validateRequiredFields = (formData: any, requiredFields: string[]): boolean => {
  let isValid = true;
  const missingFields: string[] = [];
  
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      console.error(`Missing required field: ${field}`);
      missingFields.push(field);
      isValid = false;
    }
  });
  
  if (!isValid) {
    console.error("Missing required fields:", missingFields);
  }
  
  return isValid;
};
