
// Utility to check if required fields are filled out
export const validateRequiredFields = (data: any, requiredFields: string[]): boolean => {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }
  return true;
};

// Parse string field into array, split by commas
export const parseArrayField = (field?: string): string[] | null => {
  if (!field || field.trim() === '') return null;
  return field.split(',').map(item => item.trim()).filter(item => item !== '');
};

// Parse executive members field (either as a simple array or more complex format)
export const parseExecutiveMembers = (membersStr?: string): any => {
  if (!membersStr || membersStr.trim() === '') return null;
  
  try {
    // First check if it's already valid JSON
    const parsed = JSON.parse(membersStr);
    return parsed;
  } catch (e) {
    // If not, treat as a comma-separated list
    return parseArrayField(membersStr);
  }
};

// Format array into comma-separated string
export const formatArrayToString = (array?: any[] | null): string => {
  if (!array || array.length === 0) return '';
  return array.join(', ');
};

// Convert date to appropriate format
export const formatDateForDB = (date?: string | Date): string | null => {
  if (!date) return null;
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  
  return dateObj.toISOString();
};

// Extract club data from database format to form format
export const extractClubFormData = (clubData: any) => {
  if (!clubData) return null;
  
  return {
    name: clubData.name || '',
    description: clubData.description || '',
    category: clubData.category || '',
    university: clubData.university || '',
    universityId: clubData.university_id || '',
    logoUrl: clubData.logo_url || '',
    tagline: clubData.tagline || '',
    establishedYear: clubData.established_year ? clubData.established_year.toString() : '',
    affiliation: clubData.affiliation || '',
    whyJoin: clubData.why_join || '',
    regularEvents: formatArrayToString(clubData.regular_events),
    signatureEvents: formatArrayToString(clubData.signature_events),
    communityEngagement: clubData.community_engagement || '',
    whoCanJoin: clubData.who_can_join || '',
    membershipFee: clubData.membership_fee || 'Free',
    howToJoin: clubData.how_to_join || '',
    presidentName: clubData.president_name || '',
    presidentContact: clubData.president_contact || '',
    executiveMembers: typeof clubData.executive_members === 'object' 
      ? JSON.stringify(clubData.executive_members) 
      : formatArrayToString(clubData.executive_members),
    advisors: formatArrayToString(clubData.advisors),
    phoneNumber: clubData.phone_number || '',
    website: clubData.website || '',
    facebookLink: clubData.facebook_link || '',
    instagramLink: clubData.instagram_link || '',
    twitterLink: clubData.twitter_link || '',
    discordLink: clubData.discord_link || '',
    documentUrl: clubData.document_url || '',
    documentName: clubData.document_name || ''
  };
};

// Deep log function for debugging
export const deepLog = (label: string, data: any) => {
  console.log(`--- ${label} ---`);
  try {
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('Unable to stringify data:', data);
  }
  console.log(`--- End ${label} ---`);
};
