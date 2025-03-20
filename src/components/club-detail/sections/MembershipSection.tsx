
import React from 'react';

interface MembershipSectionProps {
  whoCanJoin?: string;
  membershipFee?: string;
  howToJoin?: string;
}

const MembershipSection: React.FC<MembershipSectionProps> = ({
  whoCanJoin,
  membershipFee,
  howToJoin
}) => {
  const hasContent = whoCanJoin || membershipFee || howToJoin;
  
  if (!hasContent) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Membership Details</h3>
      
      {whoCanJoin && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Who Can Join?</h4>
          <p className="text-sm text-muted-foreground">{whoCanJoin}</p>
        </div>
      )}
      
      {membershipFee && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Membership Fee</h4>
          <p className="text-sm text-muted-foreground">{membershipFee}</p>
        </div>
      )}
      
      {howToJoin && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">How to Join</h4>
          <p className="text-sm text-muted-foreground">{howToJoin}</p>
        </div>
      )}
    </div>
  );
};

export default MembershipSection;
