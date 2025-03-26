
export const useClubValidation = () => {
  const validateClubData = (clubData: any) => {
    // Required fields for club creation
    const requiredFields = ['name', 'description', 'category', 'university', 'universityId'];
    
    // Check for missing required fields
    const missingFields = requiredFields.filter(field => !clubData[field]);
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        errorMessage: `Missing required fields: ${missingFields.join(', ')}`
      };
    }
    
    // Validate name length
    if (clubData.name.length < 3 || clubData.name.length > 100) {
      return {
        isValid: false,
        errorMessage: 'Club name must be between 3 and 100 characters'
      };
    }
    
    // Validate description length
    if (clubData.description.length < 10 || clubData.description.length > 1000) {
      return {
        isValid: false,
        errorMessage: 'Description must be between 10 and 1000 characters'
      };
    }
    
    // Validate established year if provided
    if (clubData.establishedYear && isNaN(parseInt(clubData.establishedYear))) {
      return {
        isValid: false,
        errorMessage: 'Established year must be a valid number'
      };
    }
    
    // Validate URLs if provided
    const urlFields = ['website', 'facebookLink', 'instagramLink', 'twitterLink', 'discordLink'];
    for (const field of urlFields) {
      if (clubData[field] && !isValidUrl(clubData[field])) {
        return {
          isValid: false,
          errorMessage: `Invalid URL for ${field}`
        };
      }
    }
    
    return {
      isValid: true,
      errorMessage: null
    };
  };
  
  const isValidUrl = (url: string) => {
    try {
      // Simple URL validation - check if it starts with http:// or https://
      return url === '' || /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(url);
    } catch (e) {
      return false;
    }
  };
  
  return {
    validateClubData
  };
};
