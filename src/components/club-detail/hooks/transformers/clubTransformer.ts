
import { Club } from '@/types';

/**
 * Transforms raw club data from the database into the Club type
 */
export const transformClubData = (clubData: any): Club => {
  // Process club member count
  let memberCount = 0;
  if (clubData.club_members && Array.isArray(clubData.club_members) && clubData.club_members.length > 0) {
    const countData = clubData.club_members[0];
    
    // Handle different count formats
    if (typeof countData === 'number') {
      memberCount = countData;
    } else if (typeof countData === 'string') {
      memberCount = parseInt(countData, 10) || 0;
    } else if (countData && typeof countData === 'object') {
      const rawCount = countData.count;
      if (typeof rawCount === 'number') {
        memberCount = rawCount;
      } else if (typeof rawCount === 'string') {
        memberCount = parseInt(rawCount, 10) || 0;
      }
    }
    
    memberCount = isNaN(memberCount) ? 0 : memberCount;
  }
  
  return {
    id: clubData.id,
    name: clubData.name,
    description: clubData.description,
    logoUrl: clubData.logo_url,
    category: clubData.category,
    status: clubData.status,
    rejectionReason: clubData.rejection_reason,
    memberCount: memberCount,
    events: [],
    
    // Additional fields
    tagline: clubData.tagline,
    establishedYear: clubData.established_year,
    affiliation: clubData.affiliation,
    whyJoin: clubData.why_join,
    regularEvents: clubData.regular_events,
    signatureEvents: clubData.signature_events,
    communityEngagement: clubData.community_engagement,
    whoCanJoin: clubData.who_can_join,
    membershipFee: clubData.membership_fee,
    howToJoin: clubData.how_to_join,
    phoneNumber: clubData.phone_number,
    website: clubData.website,
    facebookLink: clubData.facebook_link,
    instagramLink: clubData.instagram_link,
    twitterLink: clubData.twitter_link,
    discordLink: clubData.discord_link,
    university: clubData.university,
    
    // Leadership fields
    presidentChairName: clubData.president_chair_name || '',
    presidentChairContact: clubData.president_chair_contact || '',
    executiveMembers: clubData.executive_members || {},
    executiveMembersRoles: clubData.executive_members_roles || {},
    facultyAdvisors: clubData.faculty_advisors || [],
    primaryFacultyAdvisor: clubData.primary_faculty_advisor || ''
  };
};
