
export const clubCategories = [
  'Academic',
  'Arts',
  'Cultural',
  'Environmental',
  'Hobby',
  'Media',
  'Music',
  'Professional',
  'Service',
  'Social',
  'Sports',
  'Technology',
  'Other'
];

export const membershipTypes = [
  'Free',
  'Paid - $5/semester', 
  'Paid - $10/semester',
  'Paid - $15/semester',
  'Paid - $20/semester',
  'Paid - Custom'
];

// Field names mapping to database columns
export const clubFormFieldNames = {
  // Basic info
  name: 'name',
  description: 'description',
  category: 'category',
  university: 'university',
  logoUrl: 'logo_url',
  
  // Details
  tagline: 'tagline',
  establishedYear: 'established_year',
  affiliation: 'affiliation',
  whyJoin: 'why_join',
  regularEvents: 'regular_events',
  signatureEvents: 'signature_events',
  communityEngagement: 'community_engagement',
  
  // Leadership
  presidentName: 'president_name',
  presidentContact: 'president_contact',
  executiveMembers: 'executive_members',
  advisors: 'advisors',
  
  // Membership
  whoCanJoin: 'who_can_join',
  membershipFee: 'membership_fee',
  howToJoin: 'how_to_join',
  studentCount: 'student_count',
  facultyAdvisor: 'faculty_advisor',
  meetingInfo: 'meeting_info',
  
  // Media & Contact
  phoneNumber: 'phone_number',
  website: 'website',
  social: {
    facebook: 'facebook_link',
    instagram: 'instagram_link',
    twitter: 'twitter_link',
    linkedin: 'linkedin_link',
    discord: 'discord_link'
  },
  documentUrl: 'document_url',
  documentName: 'document_name'
};
