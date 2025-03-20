
import React from 'react';
import { CircleDollarSign, Users, LogIn } from 'lucide-react';

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
        <div className="mb-4 flex">
          <Users className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <div>
            <h4 className="font-medium text-sm mb-1">Who Can Join?</h4>
            <p className="text-sm text-muted-foreground">{whoCanJoin}</p>
          </div>
        </div>
      )}
      
      {membershipFee && (
        <div className="mb-4 flex">
          <CircleDollarSign className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <div>
            <h4 className="font-medium text-sm mb-1">Membership Fee</h4>
            <p className="text-sm text-muted-foreground">{membershipFee}</p>
          </div>
        </div>
      )}
      
      {howToJoin && (
        <div className="mb-4 flex">
          <LogIn className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
          <div>
            <h4 className="font-medium text-sm mb-1">How to Join</h4>
            <p className="text-sm text-muted-foreground">{howToJoin}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipSection;
