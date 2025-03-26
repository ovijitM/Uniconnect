/**
 * Parses a comma-separated string into an array
 */
export const parseArrayField = (value: string | undefined | null): string[] | null => {
  if (!value) return null;
  
  try {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    return null;
  } catch (error) {
    console.error("Error parsing array field:", error);
    return null;
  }
};

/**
 * Parses the executive members string into a structured JSON object
 * Format expected: "Name 1, Position 1; Name 2, Position 2"
 */
export const parseExecutiveMembers = (value: string | undefined | null): Record<string, string> | null => {
  if (!value) return null;
  
  try {
    const members: Record<string, string> = {};
    
    const memberEntries = value.split(';').map(entry => entry.trim()).filter(entry => entry.length > 0);
    
    memberEntries.forEach(entry => {
      const parts = entry.split(',').map(part => part.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const position = parts[1];
        if (name && position) {
          members[name] = position;
        }
      }
    });
    
    return Object.keys(members).length > 0 ? members : null;
  } catch (error) {
    console.error("Error parsing executive members:", error);
    return null;
  }
};

/**
 * Parses the executive members roles string into a structured JSON object
 * Format expected: "Name 1 - Position 1, Name 2 - Position 2"
 */
export const parseExecutiveMembersRoles = (value: string | undefined | null): Record<string, string> | null => {
  if (!value) return null;
  
  try {
    const members: Record<string, string> = {};
    
    const memberEntries = value.split(',').map(entry => entry.trim()).filter(entry => entry.length > 0);
    
    memberEntries.forEach(entry => {
      const parts = entry.split('-').map(part => part.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const position = parts[1];
        if (name && position) {
          members[position] = name;
        }
      }
    });
    
    return Object.keys(members).length > 0 ? members : null;
  } catch (error) {
    console.error("Error parsing executive members roles:", error);
    return null;
  }
};

/**
 * Log structured data for debugging purposes
 */
export const logFormData = (formData: any, label: string = 'Form Data') => {
  try {
    console.log(`${label}:`, JSON.stringify(formData, null, 2));
  } catch (error) {
    console.error(`Error logging form data (${label}):`, error);
    console.log(`${label} (non-stringified):`, formData);
  }
};

/**
 * Validates that required fields are present
 */
export const validateRequiredFields = (formData: any, requiredFields: string[]): boolean => {
  if (!formData) {
    console.error("Form data is undefined or null");
    return false;
  }

  let isValid = true;
  const missingFields: string[] = [];
  
  try {
    requiredFields.forEach(field => {
      if (
        formData[field] === undefined || 
        formData[field] === null || 
        (typeof formData[field] === 'string' && formData[field].trim() === '')
      ) {
        console.error(`Missing required field: ${field}`);
        missingFields.push(field);
        isValid = false;
      }
    });
    
    if (!isValid) {
      console.error("Missing required fields:", missingFields);
    }
  } catch (error) {
    console.error("Error validating required fields:", error);
    return false;
  }
  
  return isValid;
};

/**
 * Safely transform form data for API submission
 */
export const safelyTransformArrayData = (data: string | null | undefined): string[] | null => {
  if (!data) return null;
  
  if (typeof data === 'string') {
    return parseArrayField(data);
  }
  
  return null;
};

/**
 * Check for network connectivity issues
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    error.message?.includes('Failed to fetch') || 
    error.message?.includes('Network request failed') ||
    error.message?.includes('The network connection was lost') ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ECONNRESET' ||
    error.code === 'ETIMEDOUT'
  );
};

/**
 * Add a delay (for retry mechanisms)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
